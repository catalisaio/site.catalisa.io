#!/usr/bin/env python3
"""Run inside edge CT105. Remove only the dedicated site's staging BasicAuth."""
import datetime
import hashlib
import json
import os
import pathlib
import sys

apply = sys.argv[1:] == ['--apply']
if sys.argv[1:] not in [[], ['--apply']]:
    raise SystemExit('Use no arguments for plan or --apply')
route = pathlib.Path('/opt/traefik/config/dynamic/site-catalisa-staging.yml')
production = pathlib.Path('/opt/traefik/config/dynamic/catalisa-io.yml')
original = route.read_text()
assert 'site-staging.catalisa.io' in original and 'http://172.10.0.202:18181' in original
assert '    catalisa-io-site:' not in original and ':8081' not in original and ':18182' not in original
reference = '      middlewares: [catalisa-site-staging-noindex, catalisa-site-staging-auth]'
definition = ('    catalisa-site-staging-auth:\n'
              '      basicAuth:\n'
              '        usersFile: /etc/traefik/site-staging.htpasswd\n'
              '        removeHeader: true\n')
if 'catalisa-site-staging-auth' in original:
    assert original.count(reference) == 1 and original.count(definition) == 1
    updated = original.replace(reference, '      middlewares: [catalisa-site-staging-noindex]').replace(definition, '')
else:
    updated = original
assert 'basicAuth' not in updated and 'catalisa-site-staging-auth' not in updated
assert 'X-Robots-Tag: "noindex, nofollow, noarchive"' in updated
assert 'Cache-Control: "no-store"' in updated
before = hashlib.sha256(production.read_bytes()).hexdigest()
report = {'hostname': 'site-staging.catalisa.io', 'basicAuth': False, 'noindex': True,
          'noStore': True, 'productionUnchanged': True, 'applied': apply,
          'changed': apply and updated != original}
if apply and updated != original:
    backup_dir = pathlib.Path('/opt/traefik/config/rollback')
    backup_dir.mkdir(exist_ok=True)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup = backup_dir / ('site-catalisa-staging-before-open-' + stamp + '.yml')
    with open(backup, 'x', encoding='utf8') as stream:
        os.chmod(backup, 0o600)
        stream.write(original)
    temporary = pathlib.Path('/opt/traefik/config/site-catalisa-staging-open.next')
    with open(temporary, 'x', encoding='utf8') as stream:
        os.chmod(temporary, 0o600)
        stream.write(updated)
    os.replace(temporary, route)
assert hashlib.sha256(production.read_bytes()).hexdigest() == before
print(json.dumps(report))
