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
echo "== provider (adapter + independent handlers against the mock provider service)"; npx tsx scripts/qa/provider.test.mjs
# One mock provider SERVICE for the whole run: every server instance under
# test shares it, the way real instances share the real provider. Nothing is sent.
PORT_MOCK=3453; node scripts/qa/mock-provider.mjs --port $PORT_MOCK >/tmp/verify-mock-provider.log 2>&1 &
MOCK_PID=$!; trap 'kill $MOCK_PID 2>/dev/null || true' EXIT; sleep 1
export INQUIRY_MOCK_PROVIDER_URL=http://127.0.0.1:$PORT_MOCK
PORT_A=3451; PORT_B=3452
run_brand () { # brand host port paths
  local brand=$1 host=$2 port=$3 paths=$4 dist=.next-verify-$1
  echo "== build $brand"; COMPASS_BRAND=$brand COMPASS_DIST_DIR=$dist npx next build >/dev/null
  COMPASS_BRAND=$brand node scripts/qa/manifest.mjs
  # REFUSE to run against someone else's server. `next start` on a taken port
  # fails into its log and the stages below would then test whatever IS on
  # that port — a stale build passing as the current one. That happened: the
  # old cleanup matched "next start -p $port", but the process is named
  # "next-server", so every run leaked a server and later runs silently
  # verified the first run's build. Fail loudly instead.
  if curl -sf -m 2 -o /dev/null "http://127.0.0.1:$port/"; then
    echo "FAIL: port $port is already serving something. Refusing to verify against it."
    echo "      Free it first:  fuser -k $port/tcp"
    exit 1
  fi
  COMPASS_BRAND=$brand COMPASS_DIST_DIR=$dist INQUIRY_DELIVERY=mock npx next start -p $port >/tmp/verify-$brand.log 2>&1 &
  local srv=$!
  # Wait for it to actually answer rather than hoping four seconds is enough.
  local waited=0
  until curl -sf -m 2 -o /dev/null "http://127.0.0.1:$port/"; do
    sleep 1; waited=$((waited + 1))
    if ! kill -0 $srv 2>/dev/null; then echo "FAIL: $brand server exited; see /tmp/verify-$brand.log"; tail -20 "/tmp/verify-$brand.log"; exit 1; fi
    if [ $waited -ge 60 ]; then echo "FAIL: $brand server did not answer on $port within 60s"; tail -20 "/tmp/verify-$brand.log"; exit 1; fi
  done
  echo "== crawl $brand";   node scripts/qa/crawl.mjs http://localhost:$port --host $host --assets remap
  echo "== forms $brand";   COMPASS_BRAND=$brand COMPASS_DIST_DIR=$dist node scripts/qa/forms.test.mjs http://localhost:$port --host $host
  echo "== browser $brand"; node scripts/qa/browser.test.mjs http://localhost:$port --host $host --paths "$paths"
  # Kill the server AND the next-server child it spawned, then confirm the
  # port is actually free before the next brand reuses the pattern.
  kill $srv 2>/dev/null || true
  pkill -P $srv 2>/dev/null || true
  fuser -k "$port/tcp" 2>/dev/null || true
  sleep 1
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
