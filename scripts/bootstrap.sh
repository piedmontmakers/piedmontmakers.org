#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm ci --include=optional
# Fail immediately if the platform-specific build dependencies are unusable.
node --input-type=module -e 'import "sharp"; import "rolldown"'
