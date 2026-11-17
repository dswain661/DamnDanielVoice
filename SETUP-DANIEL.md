# Daniel's voice setup

This fork is for **Daniel Swainston's own** sung and whistled notes — not a celebrity
voice pack. Takes live under `projects/daniel/` and are never committed.

## Run the app

```sh
bun install
bun run doctor     # needed: bun, ffmpeg, Chrome
bun run init-daniel
bun run start      # http://127.0.0.1:4173
```

Open in **Chrome** (not headless, not a remote VM without a mic):

**http://127.0.0.1:4173/?project=daniel#record**

Wear **headphones**. Without them the mic records the guide note.

## What Daniel must do (recording cannot be automated)

1. Allow camera + microphone when Chrome asks.
2. Work through **Record**: sing each note ("ooh"/"ah", hold ~2s), then whistle the high ones.
   About fifteen minutes; you can stop and resume — progress is in `projects/daniel/takes/`.
3. **Song**: drop in an audio file you supply (any format ffmpeg reads). Pick ~90 seconds.
4. Edit words/colours under "Words and look", or edit `projects/daniel/script.json`
   (seeded from `templates/daniel-script.json`).
5. **Make** the film (or CLI below).

Optional CLI after takes exist:

```sh
bun run make --project projects/daniel --song path/to/song.mp3 \
  --title "Your Title" --credit '"Song" by Artist' --sound-only --json
# listen to projects/daniel/work/mix.wav, then:
bun run make --project projects/daniel --song path/to/song.mp3 \
  --title "Your Title" --credit '"Song" by Artist' --json
# add --stems if `bun run doctor` shows the instrument splitter is available
```

Film output: `projects/daniel/film.mp4`.

## Blockers on a cloud VM

- **No real mic/webcam session for the person** — recording must happen on Daniel's machine
  in Chrome with headphones.
- Optional `--stems` needs `uv` or `demucs` (doctor reports this; not required).
- Face centering uses macOS Vision when available; elsewhere keep your face in the middle of frame.
