#!/usr/bin/env bash
# Run inside CT105 after copying generated files to a private temporary directory.
set -euo pipefail
source_dir="${1:-}"
mode="${2:---plan}"
[[ "$source_dir" == /* && -d "$source_dir" ]] || { echo 'Provide absolute preparation directory'; exit 2; }
[[ "$mode" == --plan || "$mode" == --apply || "$mode" == --remove ]] || exit 2
config=/opt/traefik/config
route="$config/dynamic/site-catalisa-staging.yml"
users="$config/site-staging.htpasswd"
echo 'Isolated HTTPS staging: site-staging.catalisa.io -> 172.10.0.202:18181; existing router and :8081 untouched.'
[[ "$mode" != --plan ]] || exit 0
if [[ "$mode" == --remove ]]; then
  [[ -f "$route" ]] || exit 0
  mv "$route" "$source_dir/site-catalisa-staging.yml.removed"
  [[ ! -f "$users" ]] || mv "$users" "$source_dir/site-staging.htpasswd.removed"
  echo 'Only the staging router/auth were retired; certificate storage was preserved.'
  exit 0
fi
[[ -f "$source_dir/site-catalisa-staging.yml" && -f "$source_dir/site-staging.htpasswd" ]] || exit 1
[[ ! -e "$route" && ! -e "$users" ]] || { echo 'Existing staging files found; refusing to overwrite'; exit 1; }
curl --fail --silent --max-time 10 http://172.10.0.202:18181/healthz >/dev/null
install -m 600 "$source_dir/site-staging.htpasswd" "$users"
install -m 600 "$source_dir/site-catalisa-staging.yml" "$config/site-catalisa-staging.yml.next"
mv "$config/site-catalisa-staging.yml.next" "$route"
echo 'Staging-only file installed atomically. Traefik file-watch handles this without restart. Verify API router status, authoritative DNS and public TLS before browser QA.'
