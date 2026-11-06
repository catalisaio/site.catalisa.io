#!/usr/bin/env bash
# Fixed host only. No credentials or generic zone-management arguments.
set -euo pipefail
mode="${1:---plan}"
[[ "$mode" == --plan || "$mode" == --apply || "$mode" == --remove ]] || exit 2
dns_node=root@177.104.184.35
fqdn=site-staging.catalisa.io
expected=177.104.184.38
records="$(ssh -n -o BatchMode=yes -o ConnectTimeout=10 "$dns_node" 'pct exec 123 -- pdnsutil list-zone catalisa.io' | awk '$1=="site-staging.catalisa.io" {print $4 " " $5}')"
if [[ -n "$records" && "$records" != "A $expected" ]]; then echo 'Staging DNS name already has different records; refusing to overwrite'; exit 1; fi
echo "DNS plan: $fqdn A $expected TTL60; PowerDNS4.8.3 CT123; no other records are addressed."
if [[ -n "$records" ]]; then echo 'Existing staging record: expected record already present'; else echo 'Existing staging record: absent'; fi
[[ "$mode" != --plan ]] || exit 0
if [[ "$mode" == --apply ]]; then
  if [[ -n "$records" ]]; then echo 'Expected staging record already exists'; else
    ssh -n -o BatchMode=yes -o ConnectTimeout=10 "$dns_node" 'set -e; pct exec 123 -- pdnsutil add-record catalisa.io site-staging A 60 177.104.184.38; pct exec 123 -- pdnsutil increase-serial catalisa.io; pct exec 123 -- pdns_control notify catalisa.io'
  fi
else
  [[ "$records" == "A $expected" ]] || { echo 'No matching staging record to remove'; exit 1; }
  ssh -n -o BatchMode=yes -o ConnectTimeout=10 "$dns_node" 'set -e; pct exec 123 -- pdnsutil delete-rrset catalisa.io site-staging A; pct exec 123 -- pdnsutil increase-serial catalisa.io; pct exec 123 -- pdns_control notify catalisa.io'
fi
for ns in ns1.developy.cloud ns2.developy.cloud ns3.developy.cloud; do
  desired="$expected"
  [[ "$mode" != --remove ]] || desired=''
  for attempt in {1..15}; do
    answer="$(dig +time=2 +tries=1 +short A "$fqdn" "@$ns")"
    [[ "$answer" != "$desired" ]] || break
    sleep 3
  done
  [[ "$answer" == "$desired" ]] || { echo "Staging DNS verification failed at $ns"; exit 1; }
  echo "$ns: verified"
done
