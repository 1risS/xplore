for f in *.mp3; do sox "$f" "out/$f" trim 0 10; done
for f in out/*.mp3; do ffmpeg -i "$f" -c:a libvorbis -q:a 4 "${f/%mp3/ogg}"; done
