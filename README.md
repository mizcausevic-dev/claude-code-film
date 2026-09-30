# Claude Code — 20 second motion graphics film

A twenty second film about Anthropic's Claude Code, rendered from code with
[Remotion](https://remotion.dev). Seven shots, six transitions, 1200 frames at
1920×1080 / 60fps, landing on exactly 20.000 seconds.

The arc: a developer's prompt, Claude Code reading the codebase, stating a plan,
writing the diff, proving it with a passing suite, and a shipped result.

## Run it

```bash
npm install
npm run dev     # Remotion Studio, scrub and edit live
npm run build   # renders out/claude-code-film-Cursor.mp4
npm run typecheck
```

Two helper scripts render review frames from a single bundle and browser, which is
much faster than repeated `remotion still` calls:

```bash
node scripts/contact-sheet.mjs            # default review frames, scale 0.6
node scripts/contact-sheet.mjs 120,430    # specific frames
node scripts/board-frames.mjs             # one frame per shot, for the board
```

Open `shot-board-Cursor.html` for the shot board: player, proportional timing bar,
per shot notes, and the transition inventory. It reads the same numbers the
composition uses and changes its own page title if they ever disagree.

## How it is put together

| File | Role |
| --- | --- |
| `src/timeline.ts` | Single source of truth for shot lengths, transition overlaps, chapter ranges. Derives absolute shot start frames so the HUD and the shots cannot drift apart. |
| `src/theme.ts` | Palette, the two typefaces, easing curves. Blocks the first frame until glyphs are resident. |
| `src/Film.tsx` | Assembles the `TransitionSeries` and overlays the HUD. |
| `src/shots/` | One file per shot. Each one is self contained and reads `useCurrentFrame()` relative to its own sequence. |
| `src/transitions/presentations.tsx` | Four transitions written for this film: rule expand, block zoom, blade wipe, bar wipe. |
| `src/components/` | Backdrops, the Claude mark, code and diff type, panel chrome, status glyph, HUD. |

### Art direction

Serif is human, monospace is machine. The developer's intent is set in Instrument
Serif on cream paper; everything Claude Code does is JetBrains Mono on ink. The film
crosses that line exactly twice, at the handoff and at the result, so the structure
needs no captions.

A persistent HUD carries the mark, the chapter, and a progress line. Its type colour
crossfades between ink and cream at the two background changes rather than cutting,
so the furniture never flickers.

### Transitions

| Cut | Device | Source |
| --- | --- | --- |
| 1 → 2 | Rule expand. The hairline under the prompt splits open into the ink world. | written |
| 2 → 3 | Clock wipe | `@remotion/transitions` |
| 3 → 4 | Block zoom. Match cut out of the flagged line. | written |
| 4 → 5 | Blade wipe. Raked, with a lit leading edge. | written |
| 5 → 6 | Bar wipe. The passing test bar becomes the wipe. | written |
| 6 → 7 | Fade | `@remotion/transitions` |

## Scope note

The checkout API, the request chart, and the latency and 429 figures are written for
the film. They are illustrative, not measurements of Claude Code or of any live
service.
