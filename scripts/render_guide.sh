#!/usr/bin/env bash
# Render both language versions of a guide plus poster images.
# Usage (from the project root): bash render_guide.sh <guide-id> [crf]
set -euo pipefail
ID="${1:?usage: render_guide.sh <guide-id> [crf]}"
CRF="${2:-23}"
mkdir -p out
for LANG in he en; do
  npx remotion render src/index.ts "${ID}-${LANG}" "out/${ID}-${LANG}.mp4" --codec=h264 --crf="${CRF}"
  # Poster: a frame from the title card
  npx remotion still src/index.ts "${ID}-${LANG}" "out/${ID}-${LANG}.jpg" --frame=60 --image-format=jpeg
done
ls -lh out/"${ID}"-*
