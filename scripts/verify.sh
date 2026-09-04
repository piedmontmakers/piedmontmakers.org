#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm run check
node scripts/check-alt-text.mjs
node --test scripts/*.test.mjs
node scripts/check-agent-config.mjs
bash scripts/agent-hooks/test-hooks.sh
USE_CUSTOM_DOMAIN=true npm run build
node scripts/check-calendar-feed.mjs
node scripts/check-structured-data.mjs
node scripts/check-agent-readiness.mjs
npm run test:browser
