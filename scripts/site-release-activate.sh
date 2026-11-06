#!/usr/bin/env bash
# Run INSIDE marketing CT154 after copying a prepared release. No edge/DNS changes.
set -euo pipefail
target="${1:-}"
release="${2:-}"
mode="${3:---plan}"
[[ "$target" == staging || "$target" == production ]] || { echo 'Usage: site-release-activate.sh staging|production RELEASE_ID --plan|--apply|--rollback'; exit 2; }
[[ "$release" =~ ^[a-zA-Z0-9_-]{1,64}$ ]] || { echo 'Invalid release ID'; exit 2; }
[[ "$mode" == --plan || "$mode" == --apply || "$mode" == --rollback ]] || exit 2
slot="${SITE_PRODUCTION_SLOT:-}"
[[ -z "$slot" || ( "$target" == production && "$slot" == green ) ]] || { echo 'Invalid production slot'; exit 2; }
project="catalisa-site-${target}"
port=18181
if [[ "$target" == production ]]; then
  port=18182
  if [[ "$slot" == green ]]; then project=catalisa-site-production-green; port=18183; fi
fi
base="/opt/apps/${project}"
candidate="${base}/releases/${release}"
[[ -f "$candidate/release.json" && -f "$candidate/compose.yaml" && -f "$base/runtime.env" ]] || { echo 'Candidate or private runtime.env missing'; exit 1; }
[[ "$(stat -c %a "$base/runtime.env")" == 600 ]] || { echo 'runtime.env must have mode 600'; exit 1; }
python3 - "$candidate" "$target" "$port" "$slot" "$project" <<'PY'
import hashlib,json,sys,pathlib
base=pathlib.Path(sys.argv[1]); manifest=json.loads((base/'release.json').read_text())
assert manifest['target']==sys.argv[2], 'Target mismatch'
assert manifest['port']==int(sys.argv[3]) and manifest.get('productionSlot','')==sys.argv[4], 'Port/slot mismatch'
compose=(base/'compose.yaml').read_text()
assert 'ports: ["'+manifest.get('bindHost','127.0.0.1')+':'+sys.argv[3]+':80"]' in compose, 'Compose port differs'
assert 'image: '+sys.argv[5]+'-api:'+manifest['id'].lower() in compose and 'env_file: [../../runtime.env]' in compose, 'Compose slot/image differs'
for name,wanted in manifest['files'].items():
 p=base/name
 assert p.resolve().is_relative_to(base.resolve()) and not p.is_symlink(), 'Unsafe artifact path'
 assert hashlib.sha256(p.read_bytes()).hexdigest()==wanted, 'Artifact digest mismatch'
PY
echo "Candidate: $candidate; project: $project; private port: $port. Other website slots and legacy8081 are untouched."
[[ "$mode" != --plan ]] || exit 0
if [[ "$target" == production ]]; then
  [[ "${SITE_PRODUCTION_APPROVAL:-}" == "$release" ]] || { echo 'Production candidate requires recorded user authorization and SITE_PRODUCTION_APPROVAL=release ID'; exit 1; }
fi
previous="$(readlink -f "$base/current" 2>/dev/null || true)"
bind_host="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("bindHost","127.0.0.1"))' "$candidate/release.json")"
[[ "$bind_host" == 127.0.0.1 || "$bind_host" == 172.10.0.202 ]] || exit 1
restore_candidate() {
  if [[ -n "$previous" && -f "$previous/compose.yaml" ]]; then
    docker compose -p "$project" -f "$previous/compose.yaml" up -d
  else
    docker compose -p "$project" -f "$candidate/compose.yaml" stop
  fi
}
docker compose -p "$project" -f "$candidate/compose.yaml" config --quiet
if ! docker compose -p "$project" -f "$candidate/compose.yaml" up --build -d; then
  restore_candidate
  exit 1
fi
ready=false
for attempt in {1..30}; do
  if curl --fail --silent --max-time 3 "http://$bind_host:$port/healthz" >/dev/null; then
    # Session endpoint without a cookie must reach the BFF and return JSON401, never HTML/503.
    status="$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 10 "http://$bind_host:$port/api/site/session")"
    if [[ "$status" == 401 ]]; then ready=true; break; fi
  fi
  sleep 1
done
if [[ "$ready" != true ]]; then
  echo 'Candidate failed readiness. Restoring the previously active candidate.'
  restore_candidate
  exit 1
fi
if [[ -n "$previous" && "$previous" != "$candidate" ]]; then ln -sfn "$previous" "$base/previous.next"; mv -Tf "$base/previous.next" "$base/previous"; fi
ln -sfn "$candidate" "$base/current.next"
mv -Tf "$base/current.next" "$base/current"
echo "Candidate ready at http://$bind_host:$port. No public route was created or changed."
