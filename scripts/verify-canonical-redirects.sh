#!/usr/bin/env bash
# Verify canonical redirect chain for the URLs that failed Google Search
# Console's "Page with redirect" validation on 2026-04-18.
#
# Run AFTER deploying the middleware changes to production.
#
# Usage: ./scripts/verify-canonical-redirects.sh

set -u

CANONICAL="https://www.jetset-travel.com/"
CANONICAL_EN="https://www.jetset-travel.com/en/"

URLS=(
  "http://www.jetset-travel.com/"
  "http://jetset-travel.com/"
  "https://jetset-travel.com/"
  "https://www.jetset-travel.com/en/en/"
  "https://jetset-travel.com/en"
  "https://jetset-travel.com/?lang=en"
  "https://jetset-travel.com/en?lang=en"
  "https://www.jetset-travel.com/en?lang=en"
)

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
dim()  { printf '\033[2m%s\033[0m\n' "$1"; }

pass_count=0
fail_count=0

for url in "${URLS[@]}"; do
  bold "== $url"

  # -I   HEAD
  # -L   follow redirects
  # -s   silent
  # -o   drop body; keep headers on stderr via -D /dev/stderr → stdout
  # -w   report final URL + total hop count
  output=$(curl -sIL -A "JetSet-Canonical-Check/1.0" \
    --max-redirs 10 \
    -w "\n---\nfinal_url=%{url_effective}\nnum_redirects=%{num_redirects}\nhttp_code=%{http_code}\n" \
    "$url" 2>&1)

  echo "$output" | grep -iE '^(HTTP/|location:|final_url=|num_redirects=|http_code=)' || true

  hops=$(echo "$output" | grep -oE 'num_redirects=[0-9]+' | tail -1 | cut -d= -f2)
  final=$(echo "$output" | grep -oE 'final_url=[^[:space:]]+' | tail -1 | cut -d= -f2)
  code=$(echo "$output"  | grep -oE 'http_code=[0-9]+'     | tail -1 | cut -d= -f2)

  # Expected: http:// variants get 1 platform 308 + up to 1 canonical 301 = 2 max.
  # https:// variants must canonicalize in exactly 0 or 1 hop.
  if [[ "$url" == http://* ]]; then
    max_hops=2
  else
    max_hops=1
  fi

  if [[ "$final" == "$CANONICAL" || "$final" == "$CANONICAL_EN" ]] \
     && [[ "$code" == "200" ]] \
     && [[ "$hops" -le "$max_hops" ]]; then
    printf '  \033[32mPASS\033[0m hops=%s final=%s\n' "$hops" "$final"
    pass_count=$((pass_count + 1))
  else
    printf '  \033[31mFAIL\033[0m hops=%s final=%s code=%s (expected ≤%s hops, final=%s or %s, code=200)\n' \
      "$hops" "$final" "$code" "$max_hops" "$CANONICAL" "$CANONICAL_EN"
    fail_count=$((fail_count + 1))
  fi

  echo ""
done

bold "== Summary"
echo "passed: $pass_count"
echo "failed: $fail_count"

[[ "$fail_count" -eq 0 ]]
