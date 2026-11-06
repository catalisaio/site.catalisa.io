#!/usr/bin/env bash
# Run inside edge CT105. Prepared for review; default only reads and prints a plan.
set -euo pipefail
release="${1:-}"
mode="${2:---plan}"
[[ "$release" =~ ^[a-zA-Z0-9_-]{1,64}$ ]] || { echo 'Provide release ID'; exit 2; }
[[ "$mode" == --plan || "$mode" == --apply || "$mode" == --rollback ]] || exit 2
route=/opt/traefik/config/dynamic/catalisa-io.yml
previous_port="${SITE_PREVIOUS_PORT:-8081}"
candidate_port="${SITE_CANDIDATE_PORT:-18182}"
for port in "$previous_port" "$candidate_port"; do
  [[ "$port" == 8081 || "$port" == 18182 || "$port" == 18183 ]] || { echo 'Only website ports8081/18182/18183 are allowed'; exit 2; }
done
[[ "$previous_port" != "$candidate_port" ]] || { echo 'Previous and candidate ports must differ'; exit 2; }
previous="http://172.10.0.202:$previous_port"
candidate="http://172.10.0.202:$candidate_port"
backup="/opt/traefik/config/rollback/catalisa-site-${release}.yml"
python3 - "$route" "$previous" "$candidate" <<'PY'
import pathlib,sys,json
text=pathlib.Path(sys.argv[1]).read_text()
assert 'catalisa-io-svc' in text and 'catalisa.io' in text,'Unexpected production router'
assert text.count(sys.argv[2])+text.count(sys.argv[3])==1,'Unexpected or ambiguous upstream'
print(json.dumps({'plan':True,'router':'catalisa-io.yml','current':'candidate' if sys.argv[3] in text else 'legacy','candidate':sys.argv[3],'rollback':sys.argv[2],'changesUntilApply':False}))
PY
[[ "$mode" != --plan ]] || exit 0
[[ "${SITE_PRODUCTION_APPROVAL:-}" == "$release" ]] || { echo 'Explicit recorded user production approval is required'; exit 1; }
record="${SITE_PRODUCTION_APPROVAL_RECORD:-}"
[[ "$record" == /* && -f "$record" && "$(stat -c %a "$record")" == 600 ]] || { echo 'Private600 authorization record required'; exit 1; }
python3 - "$record" "$release" "$previous_port" "$candidate_port" <<'PY'
import json,sys,datetime
d=json.load(open(sys.argv[1]));assert d.get('releaseId')==sys.argv[2] and d.get('userAuthorizedProduction') is True and d.get('stagingValidated') is True,'Approval/staging evidence mismatch'
assert isinstance(d.get('userMessage'),str) and d['userMessage'].strip() and isinstance(d.get('stagingEvidence'),str) and d['stagingEvidence'].strip(),'Missing reviewable authorization/evidence'
datetime.datetime.fromisoformat(d['authorizedAt'].replace('Z','+00:00'))
if (sys.argv[3],sys.argv[4])!=('8081','18182'):
 assert d.get('previousPort')==int(sys.argv[3]) and d.get('candidatePort')==int(sys.argv[4]), 'Approval record does not bind this port transition'
PY
if [[ "$mode" == --rollback ]]; then
  # Preserve the current file for diagnosis, but restore only the known pre-cut original.
  [[ -f "$backup" ]] || { echo 'Recorded rollback file missing'; exit 1; }
  python3 - "$backup" "$previous" "$candidate" <<'PY'
import pathlib,sys
s=pathlib.Path(sys.argv[1]).read_text();assert s.count(sys.argv[2])==1 and sys.argv[3] not in s and 'catalisa-io-svc' in s,'Unexpected rollback'
PY
  install -m 600 "$backup" /opt/traefik/config/catalisa-production.next
  mv /opt/traefik/config/catalisa-production.next "$route"
  echo "Previous upstream$previous_port restored; containers and data preserved."
  exit 0
fi
curl --fail --silent --max-time 10 "$candidate/healthz" >/dev/null
[[ "$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 15 "$candidate/api/site/session")" == 401 ]] || { echo 'Production BFF readiness failed'; exit 1; }
mkdir -p /opt/traefik/config/rollback
if [[ -e "$backup" ]]; then
  # A confirmation retry may reuse only this release's unchanged original.
  python3 - "$backup" "$route" "$previous" "$candidate" <<'PY'
import pathlib,sys
old=pathlib.Path(sys.argv[1]).read_text(); current=pathlib.Path(sys.argv[2]).read_text()
assert old.count(sys.argv[3])==1 and sys.argv[4] not in old and 'catalisa-io-svc' in old, 'Unexpected rollback record'
assert current in (old,old.replace(sys.argv[3],sys.argv[4])), 'Router changed independently; inspect before retry'
PY
else
  python3 - "$route" "$previous" "$candidate" <<'PY'
import pathlib,sys
s=pathlib.Path(sys.argv[1]).read_text()
assert s.count(sys.argv[2])==1 and sys.argv[3] not in s, 'Cannot create rollback backup after an unrecorded cutover'
PY
  install -m 600 "$route" "$backup"
fi
python3 - "$route" "$previous" "$candidate" /opt/traefik/config/catalisa-production.next <<'PY'
import pathlib,sys,os
p=pathlib.Path(sys.argv[1]);s=p.read_text();assert s.count(sys.argv[2])+s.count(sys.argv[3])==1,'Upstream changed since plan'
q=pathlib.Path(sys.argv[4]);q.write_text(s.replace(sys.argv[2],sys.argv[3]));os.chmod(q,0o600)
PY
mv /opt/traefik/config/catalisa-production.next "$route"
for attempt in {1..15}; do
  # Use the local edge listener with the real hostname, SNI and trusted TLS.
  # Public-IP hairpin routing is unavailable inside this edge container.
  if curl --fail --silent --head --max-time 8 --resolve catalisa.io:443:127.0.0.1 https://catalisa.io/ | tr -d '\r' | grep -qi "^x-catalisa-site-release: ${release}$"; then
    echo "Approved release observed at the public HTTPS origin; previous upstream$previous_port remains available."
    exit 0
  fi
  sleep 2
done
install -m 600 "$backup" /opt/traefik/config/catalisa-production.next
mv /opt/traefik/config/catalisa-production.next "$route"
echo "Public release identity was not confirmed; restored upstream$previous_port automatically."
exit 1
