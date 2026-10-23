#!/usr/bin/env bash
# Optimise des COPIES de vos vidéos MP4 et images. Les originaux ne sont jamais modifiés.
# Usage : glisser un dossier sur ce script, ou : ./optimiser_assets.sh <dossier_source>
# Résultat : <dossier_source>/../assets_optimises/ (mêmes noms de fichiers) + rapport.csv
set -euo pipefail
SRC="${1:-.}"; OUT="$(cd "$SRC/.." && pwd)/assets_optimises"; mkdir -p "$OUT"
command -v ffmpeg >/dev/null || { echo "ffmpeg est nécessaire (gratuit) : https://ffmpeg.org/download.html"; exit 1; }
echo "fichier;avant_octets;apres_octets;gain_pourcent" > "$OUT/rapport.csv"
find "$SRC" -type f \( -iname '*.mp4' -o -iname '*.webp' -o -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) | while read -r f; do
  rel="${f#$SRC/}"; dst="$OUT/$rel"; mkdir -p "$(dirname "$dst")"
  case "${f,,}" in
    *.mp4) ffmpeg -nostdin -loglevel error -y -i "$f" -c:v libx264 -profile:v high -preset slow -crf 23 -vf "scale='min(1920,iw)':-2" -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$dst" ;;
    *.webp) ffmpeg -nostdin -loglevel error -y -i "$f" -c:v libwebp -quality 82 "$dst" ;;
    *) ffmpeg -nostdin -loglevel error -y -i "$f" "$dst" ;;
  esac
  a=$(stat -c%s "$f"); b=$(stat -c%s "$dst")
  if [ "$b" -ge "$a" ]; then cp "$f" "$dst"; b=$a; fi
  echo "$rel;$a;$b;$(( (a-b)*100/(a>0?a:1) ))" >> "$OUT/rapport.csv"
done
echo "Terminé. Copies dans : $OUT (voir rapport.csv)"
