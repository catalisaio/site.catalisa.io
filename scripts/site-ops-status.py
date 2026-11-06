#!/usr/bin/env python3
"""Read-only site runtime inspection inside CT154; output contains no raw logs or env."""
import argparse
import collections
import datetime
import json
import pathlib
import re
import subprocess


def command(*args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise RuntimeError('Operational command failed: ' + args[0])
    return result.stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--target', choices=('staging', 'production'), required=True)
    parser.add_argument('--slot', choices=('blue', 'green'), default='blue')
    parser.add_argument('--release', required=True)
    args = parser.parse_args()
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', args.release):
        parser.error('Invalid release identifier')
    if args.target == 'staging' and args.slot != 'blue':
        parser.error('Staging does not use production slots')
    project = ('catalisa-site-staging' if args.target == 'staging'
               else 'catalisa-site-production' + ('-green' if args.slot == 'green' else ''))
    port = 18181 if args.target == 'staging' else (18183 if args.slot == 'green' else 18182)
    base = pathlib.Path('/opt/apps') / project
    current = (base / 'current').resolve(strict=True)
    if current.parent != base / 'releases':
        raise RuntimeError('Unexpected release path')
    manifest = json.loads((current / 'release.json').read_text())
    if (manifest['target'] != args.target or manifest['id'] != args.release
            or manifest['port'] != port):
        raise RuntimeError('Requested target, release or slot does not match manifest')
    identifiers = command('docker', 'ps', '-aq', '--filter',
                          'label=com.docker.compose.project=' + project).split()
    if len(identifiers) != 2:
        raise RuntimeError('Expected exactly the site API and Caddy containers')
    containers = []
    counts = collections.Counter()
    latest = {}
    permitted = {'site_server_ready', 'site_retention_complete', 'site_retention_failed',
                 'site_market_delivery_failed', 'site_market_worker_failed'}
    for identifier in identifiers:
        info = json.loads(command('docker', 'inspect', identifier))[0]
        labels = info['Config']['Labels']
        service = labels['com.docker.compose.service']
        if labels['com.docker.compose.project'] != project or service not in {'api', 'caddy'}:
            raise RuntimeError('Container outside the selected site project')
        state = info['State']
        containers.append({'service': service, 'status': state['Status'],
                           'running': state['Running'], 'restarting': state['Restarting'],
                           'oomKilled': state['OOMKilled'], 'restartCount': info['RestartCount'],
                           'startedAt': state['StartedAt']})
        if service == 'api':
            logs = subprocess.run(['docker', 'logs', '--timestamps', '--since', '30h',
                                   '--tail', '1000', identifier], capture_output=True,
                                  text=True, timeout=30)
            if logs.returncode:
                raise RuntimeError('Unable to inspect site operational events')
            for line in (logs.stdout + '\n' + logs.stderr).splitlines():
                stamp, _, body = line.partition(' ')
                try:
                    item = json.loads(body)
                except (ValueError, TypeError):
                    continue
                if not isinstance(item, dict) or item.get('event') not in permitted:
                    continue
                event = item['event']
                counts[event] += 1
                if stamp > latest.get(event, ''):
                    latest[event] = stamp
    if {item['service'] for item in containers} != {'api', 'caddy'}:
        raise RuntimeError('Missing or duplicate site service')
    now = datetime.datetime.now(datetime.timezone.utc)
    stamp = latest.get('site_retention_complete')
    completed = datetime.datetime.fromisoformat(stamp.replace('Z', '+00:00')) if stamp else None
    recent = bool(completed and 0 <= (now - completed).total_seconds() <= 7200)
    failed_latest = latest.get('site_retention_failed', '') > (stamp or '')

    def http_status(path):
        return int(command('curl', '--silent', '--show-error', '--max-time', '10',
                           '--output', '/dev/null', '--write-out', '%{http_code}',
                           'http://172.10.0.202:' + str(port) + path))

    health, anonymous = http_status('/healthz'), http_status('/api/site/session')
    passed = (all(c['running'] and not c['restarting'] and not c['oomKilled'] for c in containers)
              and recent and not failed_latest and health == 200 and anonymous == 401)
    print(json.dumps({'checkedAt': now.isoformat(), 'passed': passed, 'target': args.target,
                      'slot': args.slot if args.target == 'production' else None,
                      'releaseId': args.release, 'project': project,
                      'scope': 'Read-only selected site containers, readiness and allowlisted event counters; no AI inference, configuration changes, deployment or outbound messages.',
                      'containers': containers, 'eventCounts': dict(counts), 'lastEvents': latest,
                      'retentionCompletedWithinTwoHours': recent,
                      'retentionFailureIsLatestEvent': failed_latest,
                      'privateHealthHttpStatus': health, 'privateAnonymousSessionHttpStatus': anonymous,
                      'limits': ['Readiness is not an AI generation or availability guarantee.',
                                 'Retention completion is bounded work, not proof all expired rows were erased.',
                                 'This inspection is not a scheduled monitor, alert receipt or accepted human support duty.']}))
    return 0 if passed else 1


if __name__ == '__main__':
    raise SystemExit(main())
