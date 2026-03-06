# FMV Dating Sim — Player

A React-based player for the FMV dating sim. Plays a single game from embedded `GAME_DATA` (e.g. in a single HTML file).

**Full documentation and history:** see the [historical-changes](historical-changes/) folder. The file [historical-changes/initial.md](historical-changes/initial.md) contains the consolidated original docs (README, PROJECT_HANDOFF, GAME_DATA, DUAL_CODEBASE_APPROACH, FMV_Dating_Sim_Build_Plan). New edits are recorded in dated files: `historical-changes/YYYY-MM-DD.md`.

## Development

```bash
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). The app uses dev game data from `src/data/devGameData.js` when `window.__GAME_DATA__` is not set.

## Build

- **Standard build:** `npm run build` → `dist/index.html` + `dist/assets/*`. Use `npm run preview` to serve.
- **Single-file build:** `npm run build:single` → `dist/game.html` (one HTML with inlined CSS, JS, and game data).

## Tests

```bash
npm run test
```
