# Choir of one

Record yourself holding every note you can sing and whistle. Then pick any song, and hear it played back
using nothing but those clips of you: a wall of your own face, one tile per note, each one lighting up when
its note sounds.

No song plays in the film it makes. Every sound is one of your clips, switched on and off. The words come
through anyway, because your brain fills them in.

## What you need

- [Bun](https://bun.sh) (runs everything)
- [ffmpeg](https://ffmpeg.org) (reads the song and your takes, writes the film)
- Google Chrome (you record in it, and the film is drawn in it)
- a webcam, a microphone and **headphones** (you hear each note before you sing it; without headphones the
  microphone records the note being played to you)
- optional: [uv](https://docs.astral.sh/uv/), to split the song into instruments so that the drums, the bass
  and the rest each get a choir of their own. It fetches the splitter (Demucs, about 2 GB) the first time.

```sh
git clone https://github.com/dswain661/DamnDanielVoice && cd DamnDanielVoice
bun install
bun run doctor     # says what is missing and how to get it
```

For Daniel Swainston's own voice project (`projects/daniel`, never committed), see
[SETUP-DANIEL.md](SETUP-DANIEL.md): `bun run init-daniel`, then open
`http://127.0.0.1:4173/?project=daniel#record` in Chrome with headphones.

## Make one

```sh
bun run start      # then open http://127.0.0.1:4173 in Chrome
# or, for Daniel's project: http://127.0.0.1:4173/?project=daniel#record
```

1. **Record.** The page plays a note, you sing it back and hold it for two seconds, and it moves to the
   next one, working outward from the middle of your voice until you run out of range in both directions.
   Then the same for whistling, which covers the high notes. Sing "ooh" or "ah", steadily. It takes
   about fifteen minutes. You can stop and carry on later.
2. **Song.** Drop in an audio file and say which 90 seconds of it to use.
3. **Make.** A few minutes later there is a film.

The more notes you record, the more of the song comes through. The high whistled notes carry most of the
consonants: without them you get the tune but not the words.

## Make it yours

Every word on the film, and its colours, are in one file in the project: `script.json`. It appears with the
defaults the first time you make a film (or run `bun cli/script.ts`), and the app's Song step has the same
fields under "Words and look". Change them. A film that says what everyone else's says is no fun.

```json
{
  "title": ["{TITLE}", "{N} notes. One voice."],
  "opening": { "takes": 3, "ids": [], "lines": ["", "", ""] },
  "captions": {
    "start": "Each tile is one note I recorded.",
    "words": "Nobody sings the words. You hear them anyway.",
    "band": "", "keys": "", "after": ""
  },
  "solo": "{PART}",
  "end": ["{N} notes. No song was played.", "{CREDIT}"],
  "accent": "#ffb340",
  "background": "#000000"
}
```

- `title` is the first frame, which is what a feed shows before the film plays. `end` is the last.
- `opening` is the few takes shown whole before the song: how many (0 starts straight on the wall), which
  ones (`"ids": ["sung-55"]`; empty lets the film choose), and a line under each.
- `captions` show at five moments: as the song starts, once the words can be heard, before the instruments
  are heard alone, during the keyboard stretch, and after it. `solo` shows while one instrument is alone.
- `{N}` is how many notes you have, `{SUNG}` and `{WHISTLED}` how many of each, `{TITLE}` and `{CREDIT}`
  what you gave, `{PART}` the instrument. An empty line is left off.
- `accent` colours the vocals and the end card; `background` can be dark or light.

## From the command line

Recording needs a person in front of a browser. Everything after that can be scripted:

```sh
bun run make --song song.mp3 --title "My Song" --stems
```

| | |
|---|---|
| `--project <dir>` | the project folder (default `projects/default`; the recorder saves there) |
| `--song <file>` | the song, in any format ffmpeg reads |
| `--title`, `--credit` | the words on the first frame, and a last line on the end card |
| `--start <s>`, `--length <s>` | which part of the song (default the first 90 s) |
| `--stems` | split the song into vocals, drums, bass and the rest first (needs uv or demucs) |
| `--reach` | also play notes outside your range, on your nearest take shifted in pitch |
| `--skip sung-80,...` | leave takes out |
| `--picture sung-78=sung-77,...` | show one take with another's picture (its sound stays its own) |
| `--stand-in sung-41` | the picture shown for takes where you leaned out of shot |
| `--sound-only` | stop at the sound (`work/mix.wav`), which takes seconds, to check it before drawing the film |
| `--json` | progress and the result as one JSON object per line |

A project is a folder under `projects/`: `takes/` (your clips and `takes.json`), the song you uploaded,
`work/` (everything made along the way, safe to delete) and `film.mp4`. Nothing in `projects/` is ever committed.

## How it works

1. **The song becomes notes.** Every 23 milliseconds the song's spectrum is taken, and its strongest peaks
   (up to 30) are each moved to the nearest piano key. A peak that stays on a key becomes a held note with a
   loudness. This is the crude kind of audio-to-MIDI that makes a "talking piano".
2. **Each note is replaced by you.** The steady middle of each of your takes is looped, nudged onto exact
   pitch, and switched on and off by the notes, as loud as each note was. Nothing else is added.
3. **Your brain does the rest.** A few dozen steady tones following the peaks of a voice's spectrum are
   enough for speech to be understood. That is the same effect as sine-wave speech.

One thing is done so that it is pleasant to listen to: each take is made as loud *to the ear* as the
others, since a high note is far more piercing than a low one of the same size. If a note sung at the very
top of your range still squeals, the result says which take it is, and `--skip` leaves it out.

With `--stems` the song is first split into vocals, drums, bass and everything else, and each is turned into
notes separately, so the film can show which of you is being the drums. It works on any song; a part the
song does not have (no drums, no singer) is left out.

## Working on it

```sh
bun test tests       # the pitch detector, on every note at two sample rates
bun run e2e          # the app end to end in headless Chrome, with a fake camera and a sine wave for a voice
bunx tsc --noEmit
DEV=1 bun run start  # rebuilds the page on every request
```

`src/` is the pipeline (`make.ts` is the whole process and reads top to bottom), `web/` is the app,
`cli/` the commands. See `AGENTS.md` for the layout and the conventions.

## The song is yours to supply

Nothing in this repository is anyone's music. The film it makes contains none of the song's audio, but it is
still a rendition of the song: if you post one, the song's rights are its owners'.

## Licence

MIT.
