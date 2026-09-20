#!/usr/bin/env bash
# Verification of the Compass website system: BOTH brands, from type checks
# through crawl, mocked form actions, browser regression checks and the
# production guards.
#
#   npm run verify                 # in an existing checkout (node_modules present)
#   FRESH=1 npm run verify         # clone this repository's HEAD into a temp
#                                  # directory, `npm ci`, and verify THAT copy —
#                                  # the documented clean-checkout run
#
# Requirements: Node 22+, npm, and a Chromium/Chrome executable. Set
# CHROMIUM_PATH to it (see README "Browser setup"); without CHROMIUM_PATH the
# runner's bundled /opt/pw-browsers/chromium or a system chromium is used.
# `node scripts/qa/browser-launch.mjs --check` prints which one.
# Delivery is mocked throughout (INQUIRY_DELIVERY=mock); nothing is sent.
set -euo pipefail
if [ "${FRESH:-0}" = "1" ]; then
  TMP=$(mktemp -d); git clone -q "$(git rev-parse --show-toplevel)" "$TMP/site"; cd "$TMP/site"
  echo "fresh clone at $(git rev-parse HEAD) in $TMP/site"; npm ci --silent
fi
echo "== browser"; node scripts/qa/browser-launch.mjs --check
echo "== type checks"; npm run -s typecheck; node scripts/qa/typecheck-brand.mjs harbor-lane
echo "== lint"; npm run -s lint
echo "== crawl fixtures"; npm run -s qa:crawl:test
export INQUIRY_IDEMPOTENCY_DIR="$(mktemp -d)"   # a clean local idempotency store for this run
export INQUIRY_MOCK_PROVIDER_DIR="$(mktemp -d)" # a clean mocked-provider ledger for this run
echo "== idempotency (module-level lease, ownership and mocked-provider contract)"; npx tsx scripts/qa/idempotency.test.mjs
PORT_A=3451; PORT_B=3452
run_brand () { # brand host port paths
  local brand=$1 host=$2 port=$3 paths=$4 dist=.next-verify-$1
  echo "== build $brand"; COMPASS_BRAND=$brand COMPASS_DIST_DIR=$dist npx next build >/dev/null
  COMPASS_BRAND=$brand node scripts/qa/manifest.mjs
  ( COMPASS_BRAND=$brand COMPASS_DIST_DIR=$dist INQUIRY_DELIVERY=mock npx next start -p $port >/tmp/verify-$brand.log 2>&1 & ); sleep 4
  echo "== crawl $brand";   node scripts/qa/crawl.mjs http://localhost:$port --host $host --assets remap
  echo "== forms $brand";   COMPASS_BRAND=$brand COMPASS_DIST_DIR=$dist node scripts/qa/forms.test.mjs http://localhost:$port --host $host
  echo "== browser $brand"; node scripts/qa/browser.test.mjs http://localhost:$port --host $host --paths "$paths"
  pkill -f "next start -p $port" || true; sleep 1
}
run_brand showme showmeelectrical.com $PORT_A "/,/services/residential/electrical-panel-upgrades,/service-area/edwardsville-il,/blog/the-most-common-electrical-hazards-found-in-missouri-homes,/contact"
run_brand harbor-lane harbor-lane.example $PORT_B "/,/locations/westfield,/service-area/northgate,/contact"
echo "== production guards (each must fail with ITS OWN message; any other failure is a real build error)"
guard () { # name expected-message env...
  local name=$1 expected=$2; shift 2
  if env "$@" npx next build >/tmp/verify-guard.log 2>&1; then echo "FAIL: $name — the build succeeded"; exit 1; fi
  if grep -qF "$expected" /tmp/verify-guard.log; then echo "ok   $name refused: \"$expected\""; else echo "FAIL: $name — build failed, but not with the guard message:"; tail -20 /tmp/verify-guard.log; exit 1; fi
}
guard "fictional brand in production" 'Refusing a production build: brand "harbor-lane" is a fictional demonstration brand.' VERCEL_ENV=production COMPASS_BRAND=harbor-lane
guard "demo fixtures in production"   'Refusing a production build: COMPASS_DEMO=true would publish fictional demo fixtures.' VERCEL_ENV=production COMPASS_DEMO=true
echo "verify: ALL PASSED"
