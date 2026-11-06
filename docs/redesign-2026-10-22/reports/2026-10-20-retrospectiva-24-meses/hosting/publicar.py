import base64
import collections
import datetime
import hashlib
import json
import pathlib
import re
import shlex
import socket
import ssl
import subprocess
import sys
import tarfile
import time
import urllib.error
import urllib.request

BASE = 'https://app.developy.cloud'
HOST = 'entregas.interno.catalisa.app'
ROOT = pathlib.Path(__file__).resolve().parent.parent
STATE = pathlib.Path('/tmp/entregas-deploy-state.json')
SESSION = pathlib.Path('/tmp/entregas-deploy-session.json')
PUBLIC_PATHS = ['/catalisa-logo.svg', '/identidade-transitoria.css', '/report-identity.css', '/', '/infografico.html', '/dossie.html', '/infografico.pdf', '/infografico-inter-regular.ttf', '/infografico-inter-bold.ttf', '/infografico-cobertura.json', '/timeline.html', '/dashboard.html', '/cadeia-de-valor.html', '/cadeia-de-valor.pdf', '/dashboard.pdf', '/dashboard-data.json', '/relatorio-completo.html', '/relatorio-completo.pdf', '/developy.html', '/developy.pdf', '/investidores.html', '/investidores.pdf', '/entrevistas.html', '/entrevistas.pdf', '/dados.json', '/dossie-catalisa.zip']
PUBLIC_PATHS += ['/diligencia.html', '/diligencia.pdf', '/diligencia-tecnica.html', '/diligencia-tecnica.pdf', '/diligencia-corporativa.html', '/diligencia-corporativa.pdf', '/diligencia-evidencias.html', '/diligencia-evidencias.pdf', '/homologacao.html', '/homologacao.pdf', '/diligencia-dados.json', '/diligencia-fontes.json', '/diligencia-pedidos.csv', '/diligencia-riscos.csv', '/homologacao-controles.csv', '/verificacao-diligencia.json', '/diligencia-acoes.csv']


def private_write(path, value):
    path.touch(mode=0o600, exist_ok=True)
    path.chmod(0o600)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2))


def token():
    if SESSION.exists():
        return json.loads(SESSION.read_text())['token']
    key = pathlib.Path('/home/klederson/.config/developy/api-key').read_text().strip()
    req = urllib.request.Request(BASE + '/api/auth/token', data=b'', headers={'Authorization': 'Bearer ' + key}, method='POST')
    with urllib.request.urlopen(req, timeout=25) as response:
        auth = json.load(response)
    result = auth.get('data', auth)['token']
    private_write(SESSION, {'token': result})
    return result


def api(path, method='GET', body=None, headers=None):
    request = urllib.request.Request(BASE + path, method=method, headers={
        'Authorization': 'Bearer ' + token(),
        'Content-Type': 'application/json',
        **(headers or {}),
    }, data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        if error.code == 401 and SESSION.exists():
            SESSION.unlink()
            return api(path, method, body, headers)
        error_body = json.loads(error.read())
        raise RuntimeError(json.dumps({'path': path, 'status': error.code, 'error': error_body.get('error', 'request failed')})) from None


def values(response, *keys):
    data = response.get('data', response) if isinstance(response, dict) else response
    if isinstance(data, list):
        return data
    for key in keys:
        if isinstance(data, dict) and isinstance(data.get(key), list):
            return data[key]
    raise RuntimeError('Unexpected response collection: ' + str(list(data) if isinstance(data, dict) else type(data)))


def state():
    if STATE.exists():
        return json.loads(STATE.read_text())
    publication = ROOT / 'hosting/publicacao.json'
    if publication.exists():
        proof = json.loads(publication.read_text())
        assert proof['url'] == 'https://' + HOST
        return {'serviceId': proof['serviceId'], 'serviceName': 'entregas-interno', 'domainAttached': HOST, 'release': proof['release']}
    return {}


def ssh(node, command, data=None):
    result = subprocess.run(['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', node, command], input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=180)
    if result.returncode:
        raise RuntimeError('SSH command failed: ' + result.stderr.decode()[-1200:])
    return result.stdout.decode()


def preflight():
    services = values(api('/api/launch/services'), 'items', 'services')
    safe = [{key: item.get(key) for key in ['id', 'name', 'orgId', 'projectId', 'status', 'runtime', 'networkPoolId', 'proxmoxNode', 'customDomains']} for item in services]
    snapshot = state()
    snapshot['inventory'] = safe
    snapshot['claims'] = {'source': 'authenticated Developy API key; opaque session token'}
    zones = values(api('/api/beacon/zones'), 'zones', 'items')
    snapshot['zones'] = [{key: zone.get(key) for key in ['id', 'name', 'fqdn', 'orgId', 'clusterId']} for zone in zones if 'catalisa.app' in zone.get('fqdn', zone.get('name', ''))]
    private_write(STATE, snapshot)
    print(json.dumps({'claims': snapshot['claims'], 'orgCounts': dict(collections.Counter(item.get('orgId') for item in safe)), 'zones': snapshot['zones'], 'rootServices': [item for item in safe if item.get('orgId') in ['user:root@pam', 'default']][:10]}, ensure_ascii=False))


def inspect():
    snapshot = state()
    zones = values(api('/api/beacon/zones'), 'zones', 'items')
    snapshot['zones'] = [{key: zone.get(key) for key in ['id', 'name', 'fqdn', 'orgId', 'clusterId']} for zone in zones]
    private_write(STATE, snapshot)
    root_services = [item for item in snapshot['inventory'] if item.get('orgId') == 'user:root@pam']
    print(json.dumps({'zones': snapshot['zones'], 'rootPools': dict(collections.Counter(item.get('networkPoolId') for item in root_services)), 'rootServices': root_services[:8]}, ensure_ascii=False))


def create():
    snapshot = state()
    if snapshot.get('serviceId'):
        print(json.dumps({'serviceId': snapshot['serviceId'], 'alreadyCreated': True}))
        return
    manifest = json.loads((ROOT / 'manifesto-sha256.json').read_text())
    for name, expected in manifest.items():
        assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == expected['sha256'], name
    auth = json.loads(pathlib.Path('/tmp/entregas-site-auth.json').read_text())
    password_hash = subprocess.run(['openssl', 'passwd', '-apr1', '-stdin'], input=(auth['password'] + '\n').encode(), stdout=subprocess.PIPE, check=True).stdout.decode().strip()
    nginx = (ROOT / 'hosting/nginx.conf').read_bytes()
    init = 'set -eu; printf %s "$REPORT_CONFIG_B64" | base64 -d > /etc/nginx/conf.d/default.conf; printf %s "$REPORT_AUTH_B64" | base64 -d > /etc/nginx/entregas.htpasswd; chown root:nginx /etc/nginx/entregas.htpasswd; chmod 640 /etc/nginx/entregas.htpasswd; nginx -t; exec nginx -g "daemon off;"'
    snapshot.setdefault('requestId', 'entregas-interno-20261020-v1')
    private_write(STATE, snapshot)
    body = {
        'requestId': snapshot['requestId'], 'name': 'entregas-interno',
        'orgId': 'user:root@pam', 'projectId': 'default',
        'runtime': 'docker', 'image': 'docker.io/library/nginx', 'tag': '1.28-alpine',
        'port': 8080, 'healthPath': '/healthz', 'size': 'xs', 'replicas': 1,
        'environment': 'staging', 'labels': {'purpose': 'retrospectiva-24-meses', 'access': 'password-protected'},
        'proxmoxNode': 'sp1-sd-catalisatec-2', 'networkPoolId': 'pool-1778851539532-el8njc',
        'volume': {'name': 'entregas', 'mount': '/srv/entregas', 'sizeGb': 1},
        'command': ['/bin/sh', '-c'], 'args': [init],
        'env': {
            'REPORT_CONFIG_B64': base64.b64encode(nginx).decode(),
            'REPORT_AUTH_B64': base64.b64encode((auth['username'] + ':' + password_hash + '\n').encode()).decode(),
        },
    }
    result = api('/api/launch/services', 'POST', body, {'x-launch-tenant-id': 'user:root@pam'})
    result = result.get('data', result)
    snapshot['serviceId'] = result['id']
    snapshot['serviceName'] = 'entregas-interno'
    private_write(STATE, snapshot)
    print(json.dumps({'serviceId': result['id'], 'status': result.get('status'), 'customDomainNotAttached': True, 'passwordInPayload': False}))


def status():
    snapshot = state()
    result = api('/api/launch/services/' + snapshot['serviceId'])
    result = result.get('data', result)
    instances = result.get('instances', result.get('replicas', []))
    if not isinstance(instances, list):
        instances = result.get('instances', [])
    snapshot['service'] = {key: result.get(key) for key in ['id', 'name', 'status', 'statusMessage', 'publicHost', 'proxmoxNode', 'networkPoolId', 'customDomains']}
    snapshot['instances'] = [{key: item.get(key) for key in ['id', 'vmid', 'proxmoxNode', 'ip', 'ipAddress', 'primaryAddress', 'status', 'healthy', 'health', 'lastError']} for item in instances]
    private_write(STATE, snapshot)
    print(json.dumps({'service': snapshot['service'], 'instanceKeys': list(instances[0]) if instances else [], 'instances': snapshot['instances']}, ensure_ascii=False))


def dns_preflight():
    snapshot = state()
    records = values(api('/api/beacon/zones/catalisa.app/records'), 'records', 'items')
    wanted = [record for record in records if record.get('name', '').rstrip('.') in [HOST, '_acme-challenge.' + HOST]]
    assert not any(record.get('type') not in ['A', 'CNAME'] for record in wanted), 'Unexpected pre-existing DNS record'
    snapshot['dnsBefore'] = wanted
    private_write(STATE, snapshot)
    print(json.dumps({'recordsBefore': wanted}, ensure_ascii=False))


def dns():
    snapshot = state()
    records = values(api('/api/beacon/zones/catalisa.app/records'), 'records', 'items')
    desired = [
        {'name': HOST, 'type': 'A', 'content': '177.104.184.38', 'ttl': 60},
        {'name': '_acme-challenge.' + HOST, 'type': 'CNAME', 'content': 'entregas-interno.acme.catalisa.app.', 'ttl': 60},
    ]
    changes = []
    for item in desired:
        matching = [record for record in records if record.get('name', '').rstrip('.') == item['name']]
        if matching:
            assert len(matching) == 1 and matching[0]['type'] == item['type'] and matching[0]['content'].rstrip('.') == item['content'].rstrip('.'), 'DNS conflict: ' + item['name']
            changes.append({'name': item['name'], 'alreadyPresent': True})
        else:
            response = api('/api/beacon/zones/catalisa.app/records', 'POST', item)
            created = response.get('data', response)
            changes.append({key: created.get(key) for key in ['id', 'name', 'type', 'content', 'ttl']})
    snapshot['dnsCreated'] = changes
    private_write(STATE, snapshot)
    print(json.dumps({'dns': changes}, ensure_ascii=False))


def bundle():
    snapshot = state()
    manifest = json.loads((ROOT / 'manifesto-sha256.json').read_text())
    names = sorted([*manifest.keys(), 'manifesto-sha256.json', 'dossie-catalisa.zip'])
    release = '20261020-' + hashlib.sha256((ROOT / 'manifesto-sha256.json').read_bytes()).hexdigest()[:12]
    path = pathlib.Path('/tmp/entregas-' + release + '.tar.gz')
    with tarfile.open(path, 'w:gz', compresslevel=3) as archive:
        for name in names:
            assert pathlib.Path(name).name == name
            archive.add(ROOT / name, arcname=name, recursive=False)
    snapshot['bundle'] = str(path)
    snapshot['release'] = release
    snapshot['bundleSha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
    private_write(STATE, snapshot)
    print(json.dumps({'release': release, 'bytes': path.stat().st_size, 'files': len(names), 'sha256': snapshot['bundleSha256']}))


def fix_auth_permissions():
    snapshot = state()
    init = 'set -eu; printf %s "$REPORT_CONFIG_B64" | base64 -d > /etc/nginx/conf.d/default.conf; printf %s "$REPORT_AUTH_B64" | base64 -d > /etc/nginx/entregas.htpasswd; chown root:nginx /etc/nginx/entregas.htpasswd; chmod 640 /etc/nginx/entregas.htpasswd; nginx -t; exec nginx -g "daemon off;"'
    result = api('/api/launch/services/' + snapshot['serviceId'], 'PATCH', {'args': [init]})
    result = result.get('data', result)
    print(json.dumps({'configured': True, 'serviceId': snapshot['serviceId'], 'effect': result.get('effect')}))


def install():
    snapshot = state()
    assert snapshot['service']['status'] == 'active', 'Wait for the isolated service to be healthy before uploading'
    assert len(snapshot['instances']) == 1
    replica = snapshot['instances'][0]
    assert replica['proxmoxNode'] == 'sp1-sd-catalisatec-2'
    vmid = int(replica['vmid'])
    node = 'root@177.104.184.35'
    config = ssh(node, f'pct config {vmid}')
    assert snapshot['serviceId'] in config or 'entregas-interno' in config, 'Guest ownership not confirmed'
    bundle = pathlib.Path(snapshot['bundle'])
    remote = '/tmp/' + bundle.name
    subprocess.run(['scp', '-q', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', str(bundle), node + ':' + remote], check=True, timeout=240)
    uploaded = ssh(node, 'sha256sum ' + shlex.quote(remote)).split()[0]
    assert uploaded == snapshot['bundleSha256'], 'Uploaded bundle mismatch'
    config = ssh(node, f'pct config {vmid}')
    assert snapshot['serviceId'] in config or 'entregas-interno' in config, 'Guest ownership changed before upload'
    ssh(node, f'pct push {vmid} {shlex.quote(remote)} {shlex.quote(remote)}')
    release = snapshot['release']
    assert all(char.isalnum() or char == '-' for char in release)
    manifest = json.loads((ROOT / 'manifesto-sha256.json').read_text())
    checksums = '\n'.join(item['sha256'] + '  ' + name for name, item in manifest.items())
    script = f'''set -eu
mkdir -p /srv/entregas/releases/{release}
tar -xzf {remote} -C /srv/entregas/releases/{release}
chmod -R a+rX /srv/entregas/releases/{release}
cd /srv/entregas/releases/{release}
sha256sum -c >/dev/null <<'CHECKSUMS'
{checksums}
CHECKSUMS
cd /srv/entregas
ln -s releases/{release} current.new
mv -Tf current.new current
if docker inspect launch-app >/dev/null 2>&1; then docker exec launch-app nginx -t; fi
printf '%s\n' '{{"manifestVerified":true,"files":{len(manifest)}}}'
'''
    output = ssh(node, f'pct exec {vmid} -- sh -s', script.encode())
    snapshot['installed'] = True
    private_write(STATE, snapshot)
    print(output)


def diagnose():
    snapshot = state()
    assert len(snapshot['instances']) == 1
    vmid = int(snapshot['instances'][0]['vmid'])
    output = ssh('root@177.104.184.35', f'pct exec {vmid} -- sh -s', b'''set -u
printf 'docker: '; command -v docker || true
printf 'daemon: '; systemctl is-active docker || true
printf 'apt processes: '; pgrep -x apt-get | wc -l
docker image inspect docker.io/library/nginx:1.28-alpine --format '{{.Id}}' 2>/dev/null || true
docker inspect --format '{{.State.Status}}' launch-app 2>/dev/null || true
''')
    print(output)


def recover_image():
    snapshot = state()
    assert snapshot['service']['status'] == 'failed' and not snapshot['instances']
    init = 'set -eu; printf %s "$REPORT_CONFIG_B64" | base64 -d > /etc/nginx/conf.d/default.conf; printf %s "$REPORT_AUTH_B64" | base64 -d > /etc/nginx/entregas.htpasswd; chown root:nginx /etc/nginx/entregas.htpasswd; chmod 640 /etc/nginx/entregas.htpasswd; nginx -t; exec nginx -g "daemon off;"'
    api('/api/launch/services/' + snapshot['serviceId'] + '/redeploy', 'POST', {'image': 'docker.io/library/nginx', 'tag': '1.28-alpine', 'args': [init]})
    for attempt in range(10):
        response = api('/api/launch/services/' + snapshot['serviceId'])
        service = response.get('data', response)
        if service.get('status') == 'failed' and not service.get('instances'):
            break
        time.sleep(1)
    else:
        raise RuntimeError('Wait for empty rollout before retry')
    api('/api/launch/services/' + snapshot['serviceId'] + '/scale', 'POST', {'replicas': 1})
    print(json.dumps({'serviceId': snapshot['serviceId'], 'explicitImageRegistry': True, 'provisioningRetried': True}))


def stage():
    snapshot = state()
    assert snapshot.get('installed') and snapshot['service']['status'] == 'active'
    assert len(snapshot['instances']) == 1
    replica = snapshot['instances'][0]
    assert replica['proxmoxNode'] == 'sp1-sd-catalisatec-2'
    auth = json.loads(pathlib.Path('/tmp/entregas-site-auth.json').read_text())
    paths = PUBLIC_PATHS
    guest = ssh('root@177.104.184.35', 'pct config ' + str(int(replica['vmid'])))
    assert snapshot['serviceId'] in guest or 'entregas-interno' in guest
    ipv4 = re.search(r'\bip=([0-9.]+)/', guest)
    assert ipv4, 'No guest management address available for isolated probe'
    spec = {'base': 'http://' + ipv4.group(1) + ':8080', 'auth': auth, 'files': {path: hashlib.sha256((ROOT / ('index.html' if path == '/' else path.lstrip('/'))).read_bytes()).hexdigest() for path in paths}}
    code = '''import base64,hashlib,json,sys,urllib.request,urllib.error
s=json.load(sys.stdin)
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
checks=[]
for path,expected in s['files'].items():
 for password in [None,'incorrect-password']:
  headers={}
  if password is not None:headers['Authorization']='Basic '+base64.b64encode((s['auth']['username']+':'+password).encode()).decode()
  try:
   with opener.open(urllib.request.Request(s['base']+path,headers=headers),timeout=30) as r:code=r.status
  except urllib.error.HTTPError as e:code=e.code
  assert code==401,(path,code)
 authorization='Basic '+base64.b64encode((s['auth']['username']+':'+s['auth']['password']).encode()).decode()
 with opener.open(urllib.request.Request(s['base']+path,headers={'Authorization':authorization}),timeout=60) as r:
  assert r.status==200,(path,r.status)
  assert r.headers.get('X-Robots-Tag')=='noindex, nofollow, noarchive'
  digest=hashlib.sha256()
  while chunk:=r.read(1048576):digest.update(chunk)
  assert digest.hexdigest()==expected,path+' hash mismatch'
 checks.append({'path':path,'anonymous':401,'incorrectPassword':401,'authenticated':200,'sha256Verified':True})
with opener.open(urllib.request.Request(s['base']+'/developy.pdf',headers={'Authorization':authorization,'Range':'bytes=0-1023'}),timeout=30) as r:
 assert r.status==206 and len(r.read())==1024,'PDF range'
print(json.dumps({'checks':checks,'pdfRangeVerified':True}))
'''
    result = json.loads(ssh('root@177.104.184.35', 'python3 -c ' + shlex.quote(code), json.dumps(spec).encode()))
    snapshot['stageVerified'] = result
    private_write(STATE, snapshot)
    print(json.dumps(result))


def publish():
    snapshot = state()
    assert snapshot.get('stageVerified') and snapshot.get('installed')
    result = api('/api/launch/services/' + snapshot['serviceId'] + '/domains', 'POST', {'domains': [HOST]})
    snapshot['domainAttached'] = HOST
    private_write(STATE, snapshot)
    print(json.dumps({'domain': HOST, 'domainAttached': True, 'certificatePendingVerification': True}))


def verify_public():
    snapshot = state()
    assert snapshot.get('domainAttached') == HOST
    auth = json.loads(pathlib.Path('/tmp/entregas-site-auth.json').read_text())
    authorization = 'Basic ' + base64.b64encode((auth['username'] + ':' + auth['password']).encode()).decode()
    checks = []
    for path in PUBLIC_PATHS:
        for header in [None, 'Basic ' + base64.b64encode(b'entregas:incorrect-password').decode()]:
            try:
                with urllib.request.urlopen(urllib.request.Request('https://' + HOST + path, method='HEAD', headers={'Authorization': header} if header else {}), timeout=25) as response:
                    status_code = response.status
            except urllib.error.HTTPError as error:
                status_code = error.code
            assert status_code == 401, (path, status_code)
        with urllib.request.urlopen(urllib.request.Request('https://' + HOST + path, method='HEAD', headers={'Authorization': authorization}), timeout=25) as response:
            assert response.status == 200, (path, response.status)
            assert response.headers.get('X-Robots-Tag') == 'noindex, nofollow, noarchive'
            checks.append({'path': path, 'anonymous': 401, 'incorrectPassword': 401, 'authenticated': 200})
    for path in ['/', '/infografico.html', '/dossie.html', '/infografico.pdf', '/infografico-inter-regular.ttf', '/infografico-inter-bold.ttf', '/timeline.html', '/dashboard.html', '/cadeia-de-valor.html']:
        with urllib.request.urlopen(urllib.request.Request('https://' + HOST + path, headers={'Authorization': authorization}), timeout=45) as response:
            actual = hashlib.sha256(response.read()).hexdigest()
        expected = hashlib.sha256((ROOT / ('index.html' if path == '/' else path[1:])).read_bytes()).hexdigest()
        assert actual == expected, path + ' deployed hash mismatch'
    context = ssl.create_default_context()
    with socket.create_connection((HOST, 443), timeout=25) as connection:
        with context.wrap_socket(connection, server_hostname=HOST) as secure:
            cert = secure.getpeercert()
            fingerprint = hashlib.sha256(secure.getpeercert(binary_form=True)).hexdigest()
    proof = {'url': 'https://' + HOST, 'username': auth['username'], 'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'checks': checks, 'tlsVerified': True, 'certificate': {'issuer': cert['issuer'], 'notAfter': cert['notAfter'], 'subjectAltName': cert['subjectAltName'], 'sha256': fingerprint}, 'htmlHashesVerified': True, 'serviceId': snapshot['serviceId'], 'release': snapshot['release']}
    snapshot['published'] = proof
    private_write(STATE, snapshot)
    (ROOT / 'hosting/publicacao.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2))
    print(json.dumps(proof, ensure_ascii=False))


def dns_check():
    results = []
    for name, kind, expected in [(HOST, 'A', '177.104.184.38'), ('_acme-challenge.' + HOST, 'CNAME', 'entregas-interno.acme.catalisa.app.')]:
        result = subprocess.run(['dig', '+time=4', '+tries=1', '@177.104.184.35', name, kind, '+short'], capture_output=True, text=True, timeout=10)
        assert result.returncode == 0 and expected in result.stdout, name + ' DNS not served yet'
        results.append({'name': name, 'type': kind, 'authoritativeAnswer': result.stdout.strip()})
    print(json.dumps({'dnsServed': results}))


def browser():
    subprocess.run(['node', str(ROOT / 'hosting/verificar-publicacao.mjs')], check=True)


def promote():
    snapshot = state()
    assert snapshot.get('published', {}).get('tlsVerified')
    result = api('/api/launch/services/' + snapshot['serviceId'], 'PATCH', {'environment': 'production'})
    print(json.dumps({'serviceId': snapshot['serviceId'], 'environment': 'production', 'effect': result.get('data', result).get('effect')}))



def verify_anonymous():
    snapshot = state()
    checks = []
    for path in PUBLIC_PATHS:
        for incorrect in [False, True]:
            headers = {'Authorization': 'Basic ' + base64.b64encode(b'entregas:incorrect-password').decode()} if incorrect else {}
            try:
                with urllib.request.urlopen(urllib.request.Request('https://' + HOST + path, method='HEAD', headers=headers), timeout=25) as response:
                    code = response.status
            except urllib.error.HTTPError as error:
                code = error.code
                assert error.headers.get('X-Robots-Tag') == 'noindex, nofollow, noarchive'
            assert code == 401, (path, code)
        checks.append({'path': path, 'anonymous': 401, 'incorrectPassword': 401})
    context = ssl.create_default_context()
    with socket.create_connection((HOST, 443), timeout=25) as connection:
        with context.wrap_socket(connection, server_hostname=HOST) as secure:
            cert = secure.getpeercert()
    replica = snapshot['instances'][0]
    vmid = int(replica['vmid'])
    config = ssh('root@177.104.184.35', f'pct config {vmid}')
    assert snapshot['serviceId'] in config or 'entregas-interno' in config
    files = sorted(json.loads((ROOT / 'manifesto-sha256.json').read_text()))
    script = b"set -eu\nreadlink -f /srv/entregas/current\ncd /srv/entregas/current\nsha256sum index.html infografico.html dossie.html infografico.pdf infografico-inter-regular.ttf infografico-inter-bold.ttf\ndocker exec launch-app nginx -t 2>&1\ndocker exec launch-app sha256sum /etc/nginx/conf.d/default.conf\ndocker exec launch-app stat -c '%a' /etc/nginx/entregas.htpasswd\n"
    script = script.replace(b'sha256sum index.html infografico.html dossie.html infografico.pdf infografico-inter-regular.ttf infografico-inter-bold.ttf', ('sha256sum ' + ' '.join(shlex.quote(name) for name in files)).encode())
    output = ssh('root@177.104.184.35', f'pct exec {vmid} -- sh -s', script)
    assert '/srv/entregas/releases/' + snapshot['release'] in output
    for filename in files:
        assert hashlib.sha256((ROOT / filename).read_bytes()).hexdigest() + '  ' + filename in output, filename
    assert hashlib.sha256((ROOT / 'hosting/nginx.conf').read_bytes()).hexdigest() in output
    assert 'test is successful' in output
    assert output.rstrip().endswith('640')
    proof = {'url': 'https://' + HOST, 'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'release': snapshot['release'], 'checks': checks, 'tlsVerified': True, 'certificate': {'notAfter': cert['notAfter'], 'subjectAltName': cert['subjectAltName']}, 'installedHashesVerified': True, 'verifiedManifestFiles': len(files), 'nginxConfigurationPreserved': True, 'passwordFileMode': '640', 'authenticatedBrowserVerification': 'pending-original-credential'}
    (ROOT / 'hosting/verificacao-sem-senha.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2))
    print(json.dumps(proof, ensure_ascii=False))

if __name__ == '__main__':
    action = sys.argv[1] if len(sys.argv) > 1 else 'preflight'
    if action == 'preflight':
        preflight()
    elif action == 'inspect':
        inspect()
    elif action == 'create':
        create()
    elif action == 'status':
        status()
    elif action == 'dns-preflight':
        dns_preflight()
    elif action == 'dns':
        dns()
    elif action == 'bundle':
        bundle()
    elif action == 'fix-auth-permissions':
        fix_auth_permissions()
    elif action == 'install':
        install()
    elif action == 'diagnose':
        diagnose()
    elif action == 'recover-image':
        recover_image()
    elif action == 'stage':
        stage()
    elif action == 'publish':
        publish()
    elif action == 'verify-anonymous':
        verify_anonymous()
    elif action == 'verify-public':
        verify_public()
    elif action == 'dns-check':
        dns_check()
    elif action == 'browser':
        browser()
    elif action == 'promote':
        promote()
    else:
        raise RuntimeError('Unknown action')
