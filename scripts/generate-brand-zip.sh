#!/usr/bin/env bash
# Generate a ZIP archive of all brand assets for the press kit download button.
set -euo pipefail

BRAND_DIR="dist/brand"
ZIP_FILE="$BRAND_DIR/catalisa-brand-assets.zip"

if [ ! -d "$BRAND_DIR" ]; then
  echo "Error: $BRAND_DIR does not exist. Run after vite build."
  exit 1
fi

rm -f "$ZIP_FILE"

cd "$BRAND_DIR"
zip -r "catalisa-brand-assets.zip" \
  *.svg \
  favicons/ \
  icons/ \
  logos/ \
  og/ \
  wallpapers/ \
  -x "catalisa-brand-assets.zip"

echo "Created $ZIP_FILE ($(du -h catalisa-brand-assets.zip | cut -f1))"
