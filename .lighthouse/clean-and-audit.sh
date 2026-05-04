#!/usr/bin/env bash
# Rebuild the SPA, copy dist into /tmp/dist-clean with the Manus dev runtime
# stripped, and audit /th + /en (mobile + desktop) with Lighthouse.
# Usage: bash .lighthouse/clean-and-audit.sh
set -euo pipefail
cd "$(dirname "$0")/.."

pnpm build >/dev/null

rm -rf /tmp/dist-clean
mkdir -p /tmp/dist-clean
cp -r dist/public/. /tmp/dist-clean/

python3 - <<'PY'
import re, pathlib
p = pathlib.Path('/tmp/dist-clean/index.html')
html = p.read_text()
for pat in [
    r'<script\s+src="/__manus__[^"]*"[^>]*>\s*</script>',
    r'<script\s+id="manus-runtime"[^>]*>[\s\S]*?</script>',
    r'<script[^>]*manus-analytics[^<]*</script>',
]:
    html = re.sub(pat, '', html)
p.write_text(html)
print(f'cleaned index.html: {len(html)} bytes')
PY

# Make sure a clean static server is running on 4174.
if ! curl -sf -o /dev/null http://localhost:4174/; then
  echo "Starting clean static server on :4174"
  nohup pnpm dlx --silent serve -s /tmp/dist-clean -l 4174 >/tmp/serve-clean.log 2>&1 &
  sleep 3
fi

export CHROME_PATH=/usr/bin/chromium
for path in /th /en; do
  for kind in mobile desktop; do
    extra=""
    [ "$kind" = "desktop" ] && extra="--preset=desktop"
    out=".lighthouse/${path//\//}-${kind}-clean.json"
    pnpm dlx --silent lighthouse "http://localhost:4174$path" \
      --quiet \
      --output=json --output-path="$out" \
      --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
      $extra \
      --only-categories=performance,accessibility,best-practices,seo \
      --skip-audits=screenshot-thumbnails,final-screenshot,full-page-screenshot \
      >/dev/null 2>&1
    echo "done $path $kind"
  done
done
node .lighthouse/summarize.cjs
