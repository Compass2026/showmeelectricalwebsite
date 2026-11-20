#!/usr/bin/env bash
# Post-cutover checks for showmeelectrical.com moving from WP Engine to Vercel.
# Read-only: nothing here sends an email (the form probes are invalid on purpose).
#
#   bash scripts/cutover-check.sh
#
# Exit code 0 = every check passed.

MAIN=https://showmeelectrical.com
CAREERS=https://careers.showmeelectrical.com
pass=0; fail=0
ok()  { printf '  \033[32mPASS\033[0m %s\n' "$1"; pass=$((pass+1)); }
bad() { printf '  \033[31mFAIL\033[0m %s\n' "$1"; fail=$((fail+1)); }

dns() { curl -s "https://cloudflare-dns.com/dns-query?name=$1&type=$2" -H 'accept: application/dns-json' \
  | python3 -c "import sys,json; print(' '.join(sorted(a['data'].rstrip('.') for a in json.load(sys.stdin).get('Answer',[]))))"; }
# expect_status URL CODE [LOCATION_PREFIX]
expect() {
  local out code loc
  out=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 20 "$1")
  code=${out%% *}; loc=${out#* }
  if [ "$code" = "$2" ] && { [ -z "$3" ] || [[ "$loc" == "$3"* ]]; }; then ok "$1 → $code ${3:+$loc}"
  else bad "$1 → got $code $loc (want $2 ${3:-})"; fi
}

echo "== DNS (public)"
a=$(dns showmeelectrical.com A);            [ "$a" = "216.150.1.1 216.150.16.1" ] && ok "apex A = $a" || bad "apex A = '$a' (want 216.150.1.1 216.150.16.1)"
w=$(dns www.showmeelectrical.com CNAME);    [ "$w" = "a368323b52c48f58.vercel-dns-016.com" ] && ok "www CNAME = $w" || bad "www CNAME = '$w'"
c=$(dns careers.showmeelectrical.com CNAME); [ "$c" = "f62e1e9f2ce96bdb.vercel-dns-016.com" ] && ok "careers CNAME unchanged" || bad "careers CNAME = '$c'"
m=$(dns showmeelectrical.com MX);           [[ "$m" == *"showmeelectrical-com.mail.protection.outlook.com"* ]] && ok "MX unchanged (Microsoft 365)" || bad "MX = '$m'"
t=$(dns showmeelectrical.com TXT);          [[ "$t" == *"v=spf1"* && "$t" == *"onmicrosoft.com"* && "$t" == *"google-site-verification"* ]] && ok "SPF + M365 + Google TXT present" || bad "TXT = '$t'"
d=$(dns _dmarc.showmeelectrical.com TXT);   [[ "$d" == *"v=DMARC1"* ]] && ok "DMARC present" || bad "DMARC = '$d'"
ad=$(dns autodiscover.showmeelectrical.com CNAME); [ "$ad" = "autodiscover.outlook.com" ] && ok "autodiscover unchanged" || bad "autodiscover = '$ad'"

echo "== Main site"
home=$(curl -s --max-time 20 "$MAIN/")
[[ "$home" == *"Electrician in St. Louis, MO | Show Me Electrical"* ]] && ok "homepage is the new site" || bad "homepage is not the new site (still WordPress, or cert not issued yet?)"
[[ "$home" == *'content="index, follow"'* ]] && ok "robots meta index, follow" || bad "robots meta missing / noindex"
[[ "$home" == *"Electrician in St. Louis"* && "$home" != *"Prototype for review"* ]] && ok "no review banner" || bad "review banner visible, or not the new site"
expect "https://www.showmeelectrical.com/" 308 "$MAIN/"
expect "http://showmeelectrical.com/" 308 "$MAIN/"
for p in /about /services /contact /service-area /blog /privacy-policy /terms-of-service /services/residential /services/commercial /services/industrial; do expect "$MAIN$p" 200; done
n=$(curl -s "$MAIN/sitemap.xml" | grep -c '<loc>https://showmeelectrical.com'); [ "$n" = 16 ] && ok "sitemap: 16 URLs on the right origin" || bad "sitemap: $n URLs"
curl -s "$MAIN/robots.txt" | grep -q "Sitemap: $MAIN/sitemap.xml" && ok "robots.txt names the sitemap" || bad "robots.txt"

echo "== Old WordPress URLs"
expect "$MAIN/about/" 308 "$MAIN/about"
expect "$MAIN/contact/" 308 "$MAIN/contact"
while read -r from to; do
  final=$(curl -s -o /dev/null -L --max-redirs 5 -w '%{http_code} %{url_effective}' "$MAIN$from")
  [ "$final" = "200 $MAIN$to" ] && ok "$from → $to" || bad "$from → $final (want 200 $MAIN$to)"
done <<'MAP'
/locations/ /service-area
/st-louis/ /services/industrial
/top-5-signs-your-home-needs-electrical-rewiring/ /blog/top-5-signs-your-home-needs-electrical-rewiring
/the-most-common-electrical-hazards-found-in-missouri-homes/ /blog/the-most-common-electrical-hazards-found-in-missouri-homes
/top-signs-you-need-to-call-an-electrician-immediately/ /blog/top-signs-you-need-to-call-an-electrician-immediately
/category/blog/ /blog
/wp-sitemap.xml /sitemap.xml
MAP
expect "$MAIN/global-styles" 410
for p in /careers/ /career/ /careers/jobs/apprentice-electrician; do
  final=$(curl -s -o /dev/null -L --max-redirs 5 -w '%{http_code} %{url_effective}' "$MAIN$p")
  [[ "$final" == "200 $CAREERS/"* ]] && ok "$p → $final" || bad "$p → $final"
done

echo "== Forms (invalid on purpose — nothing is sent)"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$MAIN/api/inquiry" -H 'content-type: application/json' -H "origin: $MAIN" -d '{"name":"probe"}')
[ "$code" = 400 ] && ok "main /api/inquiry invalid → 400 (route reached, key present)" || bad "main /api/inquiry → $code (500 = key missing)"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$CAREERS/api/apply" -F company=)
[ "$code" = 400 ] && ok "careers /api/apply invalid → 400" || bad "careers /api/apply → $code"

echo "== Careers site (must be unaffected)"
for p in / /jobs/apprentice-electrician /jobs/journeyman-electrician /jobs/electrical-estimator /jobs/administrative-assistant /og-image.png; do expect "$CAREERS$p" 200; done

echo; echo "passed $pass, failed $fail"
[ "$fail" = 0 ]
