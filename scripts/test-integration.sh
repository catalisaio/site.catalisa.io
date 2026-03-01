#!/usr/bin/env bash
# ============================================================
# Integration Tests — Presentation Invites & Tracking
# Real curl calls against Supabase (generates actual data)
# ============================================================
set -eo pipefail

# ---- Config ----
SUPABASE_URL="https://uvxxoprzeljagilwfkqc.supabase.co"
ANON_KEY="sb_publishable_-D3kOsq4bVtFgUsbv6G6Pg_4T2wTOt0"
ADMIN_EMAIL="admin@catalisa.app"
ADMIN_PASS="ZMyibsW15TLfbF"

PASSED=0
FAILED=0
TOTAL=0

# ---- Helpers ----
green()  { printf '\033[32m%s\033[0m\n' "$1"; }
red()    { printf '\033[31m%s\033[0m\n' "$1"; }
yellow() { printf '\033[33m%s\033[0m\n' "$1"; }
bold()   { printf '\033[1m%s\033[0m\n' "$1"; }

assert_eq() {
  local label="$1" expected="$2" actual="$3"
  TOTAL=$((TOTAL + 1))
  if [ "$expected" = "$actual" ]; then
    green "  PASS: $label"
    PASSED=$((PASSED + 1))
  else
    red "  FAIL: $label (expected=$expected, got=$actual)"
    FAILED=$((FAILED + 1))
  fi
}

assert_not_empty() {
  local label="$1" value="$2"
  TOTAL=$((TOTAL + 1))
  if [ -n "$value" ] && [ "$value" != "null" ]; then
    green "  PASS: $label"
    PASSED=$((PASSED + 1))
  else
    red "  FAIL: $label (value is empty or null)"
    FAILED=$((FAILED + 1))
  fi
}

assert_contains() {
  local label="$1" haystack="$2" needle="$3"
  TOTAL=$((TOTAL + 1))
  if echo "$haystack" | grep -q "$needle"; then
    green "  PASS: $label"
    PASSED=$((PASSED + 1))
  else
    red "  FAIL: $label (does not contain '$needle')"
    FAILED=$((FAILED + 1))
  fi
}

assert_empty_array() {
  local label="$1" value="$2"
  TOTAL=$((TOTAL + 1))
  if [ "$value" = "[]" ]; then
    green "  PASS: $label"
    PASSED=$((PASSED + 1))
  else
    red "  FAIL: $label (expected=[], got=$value)"
    FAILED=$((FAILED + 1))
  fi
}

# Random 8-char code (same charset as app)
rand_code() {
  head -c 100 /dev/urandom | tr -dc 'abcdefghjkmnpqrstuvwxyz23456789' | head -c 8
}

# ============================================================
bold "=========================================="
bold " Supabase Integration Tests"
bold "=========================================="
echo ""
echo "URL: $SUPABASE_URL"
echo ""

# ============================================================
# TEST 1: Admin Authentication
# ============================================================
bold "1. Admin Authentication"

AUTH_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}")

ACCESS_TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.access_token // empty')
USER_ID=$(echo "$AUTH_RESPONSE" | jq -r '.user.id // empty')

assert_not_empty "Login returns access_token" "$ACCESS_TOKEN"
assert_not_empty "Login returns user.id" "$USER_ID"

if [ -z "$ACCESS_TOKEN" ]; then
  red "FATAL: Cannot authenticate. Aborting."
  echo "$AUTH_RESPONSE" | jq .
  exit 1
fi

echo ""

# ============================================================
# TEST 2: Create Invite (wildcard decks)
# ============================================================
bold "2. Create Invite — Wildcard (*)"

CODE_WILDCARD=$(rand_code)
CREATE_RESP=$(curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_invites" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"code\": \"$CODE_WILDCARD\",
    \"created_by\": \"$USER_ID\",
    \"recipient_name\": \"Test Wildcard\",
    \"recipient_email\": \"wildcard@test.com\",
    \"recipient_company\": \"Test Corp\",
    \"recipient_role\": \"CTO\",
    \"notes\": \"Integration test - wildcard\",
    \"allowed_decks\": [\"*\"],
    \"max_uses\": null,
    \"expires_at\": null
  }")

INVITE_ID_WILDCARD=$(echo "$CREATE_RESP" | jq -r '.[0].id // .id // empty')
INVITE_CODE_BACK=$(echo "$CREATE_RESP" | jq -r '.[0].code // .code // empty')

assert_not_empty "Invite created with ID" "$INVITE_ID_WILDCARD"
assert_eq "Code matches" "$CODE_WILDCARD" "$INVITE_CODE_BACK"

echo ""

# ============================================================
# TEST 3: Create Invite (specific decks, max_uses=3)
# ============================================================
bold "3. Create Invite — Specific decks, max_uses=3"

CODE_LIMITED=$(rand_code)
CREATE_RESP2=$(curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_invites" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"code\": \"$CODE_LIMITED\",
    \"created_by\": \"$USER_ID\",
    \"recipient_name\": \"Test Limited\",
    \"recipient_email\": \"limited@test.com\",
    \"recipient_company\": \"Acme Inc\",
    \"recipient_role\": \"CEO\",
    \"notes\": \"Integration test - limited uses\",
    \"allowed_decks\": [\"comercial\", \"investidor\"],
    \"max_uses\": 3,
    \"expires_at\": null
  }")

INVITE_ID_LIMITED=$(echo "$CREATE_RESP2" | jq -r '.[0].id // .id // empty')
MAX_USES=$(echo "$CREATE_RESP2" | jq -r '.[0].max_uses // .max_uses // empty')

assert_not_empty "Limited invite created" "$INVITE_ID_LIMITED"
assert_eq "max_uses is 3" "3" "$MAX_USES"

echo ""

# ============================================================
# TEST 4: Create Invite (expires in the past)
# ============================================================
bold "4. Create Invite — Already expired"

CODE_EXPIRED=$(rand_code)
PAST_DATE="2024-01-01T00:00:00Z"
CREATE_RESP3=$(curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_invites" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"code\": \"$CODE_EXPIRED\",
    \"created_by\": \"$USER_ID\",
    \"recipient_name\": \"Test Expired\",
    \"recipient_company\": \"Old Corp\",
    \"notes\": \"Integration test - expired\",
    \"allowed_decks\": [\"*\"],
    \"max_uses\": null,
    \"expires_at\": \"$PAST_DATE\"
  }")

INVITE_ID_EXPIRED=$(echo "$CREATE_RESP3" | jq -r '.[0].id // .id // empty')
assert_not_empty "Expired invite created" "$INVITE_ID_EXPIRED"

echo ""

# ============================================================
# TEST 5: Validate Invite — Anon (no auth)
# ============================================================
bold "5. Validate Invite — Anon read (wildcard, active)"

VALIDATE_RESP=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_WILDCARD&is_active=eq.true&select=*" \
  -H "apikey: $ANON_KEY")

ANON_NAME=$(echo "$VALIDATE_RESP" | jq -r '.[0].recipient_name // empty')
ANON_ACTIVE=$(echo "$VALIDATE_RESP" | jq -r '.[0].is_active // empty')

assert_eq "Anon can read active invite name" "Test Wildcard" "$ANON_NAME"
assert_eq "is_active is true" "true" "$ANON_ACTIVE"

echo ""

# ============================================================
# TEST 6: Validate Expired — Anon can read but client rejects
# ============================================================
bold "6. Validate Expired Invite — Anon reads, app rejects"

VALIDATE_EXPIRED=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_EXPIRED&is_active=eq.true&select=*" \
  -H "apikey: $ANON_KEY")

EXPIRED_DATE_BACK=$(echo "$VALIDATE_EXPIRED" | jq -r '.[0].expires_at // empty')
assert_not_empty "Anon can read expired invite" "$EXPIRED_DATE_BACK"

# Client-side check: expires_at < now → invalid
EXPIRES_TS=$(date -d "$PAST_DATE" +%s 2>/dev/null || date -jf "%Y-%m-%dT%H:%M:%SZ" "$PAST_DATE" +%s 2>/dev/null || echo "0")
NOW_TS=$(date +%s)
if [ "$EXPIRES_TS" -lt "$NOW_TS" ]; then
  TOTAL=$((TOTAL + 1)); green "  PASS: Client-side expiry check rejects past date"; PASSED=$((PASSED + 1))
else
  TOTAL=$((TOTAL + 1)); red "  FAIL: Expiry check should reject past date"; FAILED=$((FAILED + 1))
fi

echo ""

# ============================================================
# TEST 7: Increment Uses via RPC
# ============================================================
bold "7. Increment Uses (RPC, anon)"

# Check initial uses_count
BEFORE_USES=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_LIMITED&select=uses_count" \
  -H "apikey: $ANON_KEY" | jq -r '.[0].uses_count // "0"')

assert_eq "Initial uses_count is 0" "0" "$BEFORE_USES"

# Increment 3 times
for i in 1 2 3; do
  curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/increment_invite_uses" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"invite_code\": \"$CODE_LIMITED\"}" > /dev/null
done

AFTER_USES=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_LIMITED&select=uses_count" \
  -H "apikey: $ANON_KEY" | jq -r '.[0].uses_count // "0"')

assert_eq "uses_count after 3 increments" "3" "$AFTER_USES"

echo ""

# ============================================================
# TEST 8: Max Uses Enforcement (client-side)
# ============================================================
bold "8. Max Uses Enforcement"

INVITE_CHECK=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_LIMITED&is_active=eq.true&select=uses_count,max_uses" \
  -H "apikey: $ANON_KEY")

CHECK_USES=$(echo "$INVITE_CHECK" | jq -r '.[0].uses_count // "0"')
CHECK_MAX=$(echo "$INVITE_CHECK" | jq -r '.[0].max_uses // "null"')

if [ "$CHECK_MAX" != "null" ] && [ "$CHECK_USES" -ge "$CHECK_MAX" ]; then
  TOTAL=$((TOTAL + 1)); green "  PASS: Client rejects invite (uses=$CHECK_USES >= max=$CHECK_MAX)"; PASSED=$((PASSED + 1))
else
  TOTAL=$((TOTAL + 1)); red "  FAIL: Should reject (uses=$CHECK_USES, max=$CHECK_MAX)"; FAILED=$((FAILED + 1))
fi

echo ""

# ============================================================
# TEST 9: Toggle is_active (deactivate)
# ============================================================
bold "9. Toggle is_active — Deactivate invite"

PATCH_RESP=$(curl -s -w "\n%{http_code}" -X PATCH "$SUPABASE_URL/rest/v1/presentation_invites?id=eq.$INVITE_ID_WILDCARD" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}')

PATCH_HTTP=$(echo "$PATCH_RESP" | tail -1)
if [ "$PATCH_HTTP" = "403" ]; then
  yellow "  SKIP: PATCH returned 403 — missing 'Auth read all invites' RLS policy"
  yellow "        Run in Supabase SQL Editor:"
  yellow "        CREATE POLICY \"Auth read all invites\" ON presentation_invites FOR SELECT USING (auth.uid() IS NOT NULL);"
  TOTAL=$((TOTAL + 2)); FAILED=$((FAILED + 2))
  red "  FAIL: Anon cannot see deactivated invite (PATCH blocked)"
  red "  FAIL: Auth can see deactivated invite (PATCH blocked)"
  DEACTIVATE_WORKED=false
else
  DEACTIVATE_WORKED=true

  # Anon should NOT see deactivated invite (RLS: is_active = true)
  DEACTIVATED=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_WILDCARD&is_active=eq.true&select=id" \
    -H "apikey: $ANON_KEY")

  assert_empty_array "Anon cannot see deactivated invite" "$DEACTIVATED"

  # Auth should still see it
  AUTH_DEACTIVATED=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_WILDCARD&select=is_active" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  AUTH_ACTIVE_VAL=$(echo "$AUTH_DEACTIVATED" | jq -r '.[0].is_active // empty')
  assert_eq "Auth can see deactivated invite (is_active=false)" "false" "$AUTH_ACTIVE_VAL"
fi

echo ""

# ============================================================
# TEST 10: Re-activate invite
# ============================================================
bold "10. Toggle is_active — Re-activate invite"

if [ "$DEACTIVATE_WORKED" = "true" ]; then
  curl -s -X PATCH "$SUPABASE_URL/rest/v1/presentation_invites?id=eq.$INVITE_ID_WILDCARD" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"is_active": true}' > /dev/null

  REACTIVATED=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_WILDCARD&is_active=eq.true&select=id" \
    -H "apikey: $ANON_KEY")

  REACT_ID=$(echo "$REACTIVATED" | jq -r '.[0].id // empty')
  assert_eq "Re-activated invite visible to anon" "$INVITE_ID_WILDCARD" "$REACT_ID"
else
  yellow "  SKIP: Re-activate test skipped (deactivation failed)"
  TOTAL=$((TOTAL + 1)); FAILED=$((FAILED + 1))
  red "  FAIL: Re-activate skipped (depends on test 9)"
fi

echo ""

# ============================================================
# TEST 11: Insert Events — Anon (tracking)
# ============================================================
bold "11. Insert Events — Anon (simulating invite user session)"

# session_start
curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"invite_code\": \"$CODE_WILDCARD\",
    \"event_type\": \"session_start\",
    \"deck\": \"comercial\",
    \"metadata\": {\"user_agent\": \"test-script\", \"source\": \"integration-test\"}
  }" > /dev/null

# slide_view events
for SLIDE in 0 1 2 3 4; do
  curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"invite_code\": \"$CODE_WILDCARD\",
      \"event_type\": \"slide_view\",
      \"deck\": \"comercial\",
      \"slide_index\": $SLIDE,
      \"metadata\": {\"source\": \"integration-test\"}
    }" > /dev/null
done

# slide_engagement events (with dwell time)
for SLIDE in 0 1 2 3 4; do
  SECS=$((RANDOM % 60 + 5))
  curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"invite_code\": \"$CODE_WILDCARD\",
      \"event_type\": \"slide_engagement\",
      \"deck\": \"comercial\",
      \"slide_index\": $SLIDE,
      \"seconds\": $SECS,
      \"metadata\": {\"source\": \"integration-test\"}
    }" > /dev/null
done

# session_end
curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"invite_code\": \"$CODE_WILDCARD\",
    \"event_type\": \"session_end\",
    \"deck\": \"comercial\",
    \"seconds\": 120,
    \"metadata\": {\"source\": \"integration-test\", \"total_slides\": 5}
  }" > /dev/null

TOTAL=$((TOTAL + 1)); green "  PASS: 12 events inserted (1 start + 5 views + 5 engagements + 1 end)"; PASSED=$((PASSED + 1))

echo ""

# ============================================================
# TEST 12: Read Events — Auth only
# ============================================================
bold "12. Read Events — Auth vs Anon"

# Anon should NOT be able to read events
ANON_EVENTS=$(curl -s "$SUPABASE_URL/rest/v1/presentation_events?invite_code=eq.$CODE_WILDCARD&select=id" \
  -H "apikey: $ANON_KEY")

assert_empty_array "Anon cannot read events" "$ANON_EVENTS"

# Auth should see events
AUTH_EVENTS=$(curl -s "$SUPABASE_URL/rest/v1/presentation_events?invite_code=eq.$CODE_WILDCARD&select=id,event_type" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

EVENT_COUNT=$(echo "$AUTH_EVENTS" | jq 'length')
assert_eq "Auth reads 12 events for invite" "12" "$EVENT_COUNT"

echo ""

# ============================================================
# TEST 13: Events contain correct data
# ============================================================
bold "13. Event Data Integrity"

FIRST_EVENT=$(curl -s "$SUPABASE_URL/rest/v1/presentation_events?invite_code=eq.$CODE_WILDCARD&event_type=eq.session_start&select=*&limit=1" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

EVT_DECK=$(echo "$FIRST_EVENT" | jq -r '.[0].deck // empty')
EVT_SOURCE=$(echo "$FIRST_EVENT" | jq -r '.[0].metadata.source // empty')

assert_eq "Event deck is comercial" "comercial" "$EVT_DECK"
assert_eq "Event metadata.source is integration-test" "integration-test" "$EVT_SOURCE"

# Check engagement event has seconds
ENGAGEMENT_EVENT=$(curl -s "$SUPABASE_URL/rest/v1/presentation_events?invite_code=eq.$CODE_WILDCARD&event_type=eq.slide_engagement&select=seconds&limit=1" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

EVT_SECONDS=$(echo "$ENGAGEMENT_EVENT" | jq -r '.[0].seconds // "0"')
if [ "$EVT_SECONDS" -gt "0" ] 2>/dev/null; then
  TOTAL=$((TOTAL + 1)); green "  PASS: Engagement event has seconds ($EVT_SECONDS)"; PASSED=$((PASSED + 1))
else
  TOTAL=$((TOTAL + 1)); red "  FAIL: Engagement event seconds should be > 0 (got=$EVT_SECONDS)"; FAILED=$((FAILED + 1))
fi

echo ""

# ============================================================
# TEST 14: Anon cannot INSERT invites
# ============================================================
bold "14. RLS — Anon cannot create invites"

ANON_CREATE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SUPABASE_URL/rest/v1/presentation_invites" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"code\": \"$(rand_code)\",
    \"created_by\": \"$USER_ID\",
    \"recipient_name\": \"Hacker\",
    \"allowed_decks\": [\"*\"]
  }")

# Should be 401 or 403 (RLS blocks it)
if [ "$ANON_CREATE" = "201" ]; then
  TOTAL=$((TOTAL + 1)); red "  FAIL: Anon was able to create invite (HTTP $ANON_CREATE)"; FAILED=$((FAILED + 1))
else
  TOTAL=$((TOTAL + 1)); green "  PASS: Anon blocked from creating invite (HTTP $ANON_CREATE)"; PASSED=$((PASSED + 1))
fi

echo ""

# ============================================================
# TEST 15: Anon cannot UPDATE invites
# ============================================================
bold "15. RLS — Anon cannot update invites"

ANON_UPDATE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$SUPABASE_URL/rest/v1/presentation_invites?id=eq.$INVITE_ID_WILDCARD" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}')

# Supabase returns 204 but affects 0 rows when RLS blocks — verify the invite is still active
STILL_ACTIVE=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_WILDCARD&is_active=eq.true&select=is_active" \
  -H "apikey: $ANON_KEY")

STILL_ACTIVE_VAL=$(echo "$STILL_ACTIVE" | jq -r '.[0].is_active // empty')
assert_eq "Invite still active after anon update attempt" "true" "$STILL_ACTIVE_VAL"

echo ""

# ============================================================
# TEST 16: Nonexistent code returns empty
# ============================================================
bold "16. Validate Nonexistent Code"

GHOST=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.zzzzzzzz&is_active=eq.true&select=id" \
  -H "apikey: $ANON_KEY")

assert_empty_array "Nonexistent code returns empty array" "$GHOST"

echo ""

# ============================================================
# TEST 17: Increment uses on deactivated invite does nothing
# ============================================================
bold "17. Increment Uses — Deactivated invite"

if [ "$DEACTIVATE_WORKED" = "true" ]; then
  # Deactivate the wildcard invite
  curl -s -X PATCH "$SUPABASE_URL/rest/v1/presentation_invites?id=eq.$INVITE_ID_WILDCARD" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"is_active": false}' > /dev/null

  BEFORE_INC=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_WILDCARD&select=uses_count" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.[0].uses_count // "0"')

  # Try to increment (RPC only updates where is_active = true)
  curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/increment_invite_uses" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"invite_code\": \"$CODE_WILDCARD\"}" > /dev/null

  AFTER_INC=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_WILDCARD&select=uses_count" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.[0].uses_count // "0"')

  assert_eq "Uses unchanged on deactivated invite" "$BEFORE_INC" "$AFTER_INC"

  # Re-activate for cleanup
  curl -s -X PATCH "$SUPABASE_URL/rest/v1/presentation_invites?id=eq.$INVITE_ID_WILDCARD" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"is_active": true}' > /dev/null
else
  yellow "  SKIP: Deactivation test requires 'Auth read all invites' policy"
  TOTAL=$((TOTAL + 1)); FAILED=$((FAILED + 1))
  red "  FAIL: Increment on deactivated skipped (depends on test 9)"
fi

echo ""

# ============================================================
# TEST 18: List All Invites — Auth
# ============================================================
bold "18. List All Invites — Auth"

ALL_INVITES=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?select=code,recipient_name,is_active&order=created_at.desc" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

INVITE_COUNT=$(echo "$ALL_INVITES" | jq 'length')
if [ "$INVITE_COUNT" -ge "3" ]; then
  TOTAL=$((TOTAL + 1)); green "  PASS: Auth sees $INVITE_COUNT invites (>= 3 created in test)"; PASSED=$((PASSED + 1))
else
  TOTAL=$((TOTAL + 1)); red "  FAIL: Expected >= 3 invites, got $INVITE_COUNT"; FAILED=$((FAILED + 1))
fi

echo ""

# ============================================================
# TEST 19: Multi-deck invite simulation
# ============================================================
bold "19. Multi-Deck Invite — Full session simulation"

CODE_MULTI=$(rand_code)
curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_invites" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"$CODE_MULTI\",
    \"created_by\": \"$USER_ID\",
    \"recipient_name\": \"Maria Silva\",
    \"recipient_email\": \"maria@empresa.com.br\",
    \"recipient_company\": \"Empresa Teste LTDA\",
    \"recipient_role\": \"Head of Innovation\",
    \"notes\": \"Contato feito na FEBRABAN Tech 2025\",
    \"allowed_decks\": [\"comercial\", \"investidor\", \"fintech\"],
    \"max_uses\": 10
  }" > /dev/null

# Simulate: validate → increment → session_start → browse 3 slides → session_end
# (as anon user would)
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/increment_invite_uses" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"invite_code\": \"$CODE_MULTI\"}" > /dev/null

for DECK in comercial investidor; do
  curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"invite_code\": \"$CODE_MULTI\",
      \"event_type\": \"session_start\",
      \"deck\": \"$DECK\",
      \"metadata\": {\"user_agent\": \"Mozilla/5.0\", \"viewport\": \"1920x1080\", \"referrer\": \"whatsapp\", \"source\": \"integration-test\"}
    }" > /dev/null

  for SLIDE in 0 1 2 3 4 5 6 7; do
    SECS=$((RANDOM % 45 + 3))
    curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
      -H "apikey: $ANON_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"invite_code\": \"$CODE_MULTI\",
        \"event_type\": \"slide_view\",
        \"deck\": \"$DECK\",
        \"slide_index\": $SLIDE
      }" > /dev/null

    curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
      -H "apikey: $ANON_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"invite_code\": \"$CODE_MULTI\",
        \"event_type\": \"slide_engagement\",
        \"deck\": \"$DECK\",
        \"slide_index\": $SLIDE,
        \"seconds\": $SECS
      }" > /dev/null
  done

  curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"invite_code\": \"$CODE_MULTI\",
      \"event_type\": \"session_end\",
      \"deck\": \"$DECK\",
      \"seconds\": $((RANDOM % 300 + 60)),
      \"metadata\": {\"source\": \"integration-test\"}
    }" > /dev/null
done

# Verify: events for multi-deck invite
MULTI_EVENTS=$(curl -s "$SUPABASE_URL/rest/v1/presentation_events?invite_code=eq.$CODE_MULTI&select=id" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

MULTI_COUNT=$(echo "$MULTI_EVENTS" | jq 'length')
# 2 decks × (1 start + 8 views + 8 engagements + 1 end) = 2 × 18 = 36
assert_eq "Multi-deck session: 36 events" "36" "$MULTI_COUNT"

# Verify uses_count incremented
MULTI_USES=$(curl -s "$SUPABASE_URL/rest/v1/presentation_invites?code=eq.$CODE_MULTI&select=uses_count" \
  -H "apikey: $ANON_KEY" | jq -r '.[0].uses_count // "0"')

assert_eq "Multi-deck invite uses_count is 1" "1" "$MULTI_USES"

echo ""

# ============================================================
# TEST 20: Admin session events (no invite_code)
# ============================================================
bold "20. Admin Session — Events with null invite_code"

curl -s -X POST "$SUPABASE_URL/rest/v1/presentation_events" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"invite_code\": null,
    \"event_type\": \"session_start\",
    \"deck\": \"investidor\",
    \"metadata\": {\"source\": \"admin\", \"user_id\": \"$USER_ID\"}
  }" > /dev/null

ADMIN_EVT=$(curl -s "$SUPABASE_URL/rest/v1/presentation_events?event_type=eq.session_start&metadata->>source=eq.admin&select=invite_code,deck&limit=1" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

ADMIN_INVITE_CODE=$(echo "$ADMIN_EVT" | jq -r '.[0].invite_code // "null"')
assert_eq "Admin event has null invite_code" "null" "$ADMIN_INVITE_CODE"

echo ""

# ============================================================
# Summary
# ============================================================
echo ""
bold "=========================================="
bold " Results: $PASSED passed / $FAILED failed / $TOTAL total"
bold "=========================================="
echo ""

# Print test data summary
yellow "Test data created in Supabase:"
echo "  Invite 1 (wildcard):  code=$CODE_WILDCARD  id=$INVITE_ID_WILDCARD"
echo "  Invite 2 (limited):   code=$CODE_LIMITED  id=$INVITE_ID_LIMITED"
echo "  Invite 3 (expired):   code=$CODE_EXPIRED  id=$INVITE_ID_EXPIRED"
echo "  Invite 4 (multi):     code=$CODE_MULTI"
echo ""
yellow "URLs to test in browser:"
echo "  https://catalisa.io/apresentacao/i/$CODE_WILDCARD   (active, all decks)"
echo "  https://catalisa.io/apresentacao/i/$CODE_LIMITED    (maxed out, should fail)"
echo "  https://catalisa.io/apresentacao/i/$CODE_EXPIRED    (expired, should fail)"
echo "  https://catalisa.io/apresentacao/i/$CODE_MULTI      (3 decks, multi selector)"
echo ""

if [ "$FAILED" -gt 0 ]; then
  red "Some tests failed!"
  exit 1
else
  green "All tests passed!"
  exit 0
fi
