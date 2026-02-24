#!/usr/bin/env bash
# Convert PNG/JPG images larger than 100KB to WebP (keeps originals)
# Requires: cwebp (apt install webp / brew install webp)
set -euo pipefail

MIN_SIZE=102400  # 100KB in bytes
SRC_DIR="${1:-public}"

if ! command -v cwebp &>/dev/null; then
  echo "ERROR: cwebp not found. Install with: sudo apt install webp (or brew install webp)"
  exit 1
fi

converted=0

while IFS= read -r -d '' file; do
  size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
  if [ "$size" -gt "$MIN_SIZE" ]; then
    webp="${file%.*}.webp"
    if [ ! -f "$webp" ]; then
      echo "Converting: $file → $webp"
      cwebp -q 80 "$file" -o "$webp"
      converted=$((converted + 1))
    fi
  fi
done < <(find "$SRC_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -not -path "*/og/*" -print0)

echo "Done: $converted images converted to WebP (originals preserved, og/ excluded)"
