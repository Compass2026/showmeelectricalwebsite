#!/usr/bin/env bash
# Clean-checkout verification of the Compass website system, both brands.
#   bash scripts/qa/verify.sh            # from a checkout with node_modules
#   FRESH=1 bash scripts/qa/verify.sh    # clone HEAD into a temp dir first
# Requires Node 20+, npm, and the bundled Chromium (PLAYWRIGHT executable
# at /opt/pw-browsers/chromium or CHROMIUM_PATH) for the form tests.
set -euo pipefail
if [ "${FRESH:-0}" = "1" ]; then
  TMP=$(mktemp -d); git clone -q "$(git rev-parse --show-toplevel)" "$TMP/site"; cd "$TMP/site"
  echo "fresh clone at $(git rev-parse HEAD) in $TMP/site"; npm ci --silent
fi
echo "== type checks"; npm run -s typecheck; node scripts/qa/typecheck-brand.mjs harbor-lane
echo "== lint"; npm run -s lint
echo "== crawl fixtures"; npm run -s qa:crawl:test
PORT_A=3451; PORT_B=3452
run_brand () { # brand host origin port extra-env...
  local brand=$1 host=$2 port=$3
  echo "== build $brand"; COMPASS_BRAND=$brand npx next build >/dev/null
  COMPASS_BRAND=$brand node scripts/qa/manifest.mjs
  ( COMPASS_BRAND=$brand INQUIRY_DELIVERY=mock npx next start -p $port >/tmp/verify-$brand.log 2>&1 & ); sleep 4
  node scripts/qa/crawl.mjs http://localhost:$port --host $host --assets remap
  node scripts/qa/forms.test.mjs http://localhost:$port --host $host
  pkill -f "next start -p $port" || true; sleep 1
}
run_brand showme showmeelectrical.com $PORT_A
run_brand harbor-lane harbor-lane.example $PORT_B
echo "== production guard"
if VERCEL_ENV=production COMPASS_BRAND=harbor-lane npx next build >/tmp/verify-guard.log 2>&1; then echo "FAIL: fictional brand built for production"; exit 1; else echo "ok   fictional brand refused for production"; fi
if VERCEL_ENV=production COMPASS_DEMO=true npx next build >/tmp/verify-guard2.log 2>&1; then echo "FAIL: demo fixtures built for production"; exit 1; else echo "ok   demo fixtures refused for production"; fi
echo "verify: ALL PASSED"
