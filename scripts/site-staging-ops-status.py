#!/usr/bin/env python3
"""Run inside CT154: report only the site's staging status and safe log counters."""
import collections
import datetime
import json
import pathlib
import re
import subprocess
import sys

assert len(sys.argv) <= 2, 'Provide at most one expected release ID'
release = sys.argv[1] if len(sys.argv) == 2 else None
assert release is None or re.fullmatch(r'[A-Za-z0-9_-]{1,64}', release)
base = pathlib.Path('/opt/apps/catalisa-site-staging')
current = (base / 'current').resolve(strict=True)
assert current.parent == base / 'releases'
manifest = json.loads((current / 'release.json').read_text())
assert manifest['target'] == 'staging' and (release is None or manifest['id'] == release)
release = manifest['id']

def run(*args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=25)
    if result.returncode:
        raise RuntimeError('Operational command failed: ' + args[0])
    return result.stdout

ids = run('docker', 'ps', '-aq', '--filter', 'label=com.docker.compose.project=catalisa-site-staging').split()
assert len(ids) == 2, 'Expected exactly the staging API and Caddy containers'
containers = []
events = collections.Counter()
last_events = {}
allowed_events = {'site_server_ready', 'site_retention_complete', 'site_retention_failed',
                  'site_market_delivery_failed', 'site_market_worker_failed'}
for container_id in ids:
    info = json.loads(run('docker', 'inspect', container_id))[0]
    labels = info['Config']['Labels']
    assert labels['com.docker.compose.project'] == 'catalisa-site-staging'
    service = labels['com.docker.compose.service']
    assert service in {'api', 'caddy'}
    state = info['State']
    containers.append({'service': service, 'status': state['Status'], 'running': state['Running'],
                       'restarting': state['Restarting'], 'oomKilled': state['OOMKilled'],
                       'restartCount': info['RestartCount'], 'startedAt': state['StartedAt']})
    if service == 'api':
        # Docker can route application logs to either stream. Never print raw lines or payloads.
        logs = subprocess.run(['docker', 'logs', '--timestamps', '--since', '30h', '--tail', '1000', container_id],
                              capture_output=True, text=True, timeout=25)
        assert logs.returncode == 0
        for line in (logs.stdout + '\n' + logs.stderr).splitlines():
            stamp, _, content = line.partition(' ')
            try:
                item = json.loads(content)
            except (ValueError, TypeError):
                continue
            event = item.get('event')
            if event in allowed_events:
                events[event] += 1
                if stamp > last_events.get(event, ''):
                    last_events[event] = stamp

now = datetime.datetime.now(datetime.timezone.utc)
stamp = last_events.get('site_retention_complete')
completed_at = datetime.datetime.fromisoformat(stamp.replace('Z', '+00:00')) if stamp else None
recent_completion = bool(completed_at and 0 <= (now - completed_at).total_seconds() <= 7200)
failure_is_latest = last_events.get('site_retention_failed', '') > (stamp or '')
health = run('curl', '--silent', '--show-error', '--max-time', '10', '--output', '/dev/null',
             '--write-out', '%{http_code}', 'http://172.10.0.202:18181/healthz')
anonymous = run('curl', '--silent', '--show-error', '--max-time', '10', '--output', '/dev/null',
                '--write-out', '%{http_code}', 'http://172.10.0.202:18181/api/site/session')
passed = (all(c['running'] and not c['restarting'] and not c['oomKilled'] for c in containers)
          and recent_completion and not failure_is_latest and health == '200' and anonymous == '401')
report = {'checkedAt': now.isoformat(), 'passed': passed, 'target': 'staging', 'releaseId': release,
          'scope': 'Current staging containers, HTTP readiness and safe event counters from the last30h/max1000log lines. No deployment/configuration change or outbound message.',
          'containers': containers, 'eventCounts': dict(events), 'lastEvents': last_events,
          'retentionCompletedWithinTwoHours': recent_completion, 'retentionFailureIsLatestEvent': failure_is_latest,
          'privateHealthHttpStatus': int(health), 'privateAnonymousSessionHttpStatus': int(anonymous),
          'limits': ['Readiness is not a live AI inference or an availability guarantee.',
                     'A completed retention cycle is bounded work, not proof every expired row was erased.',
                     'This probe is not a scheduled monitor, alert receipt or accepted human support duty.']}
print(json.dumps(report))
if not passed:
    raise SystemExit(1)
