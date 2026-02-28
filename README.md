# FMV Dating Sim — Player

A React-based player for the FMV dating sim. Plays a single game from embedded `GAME_DATA` (e.g. in a single HTML file).

## Development

```bash
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). The app uses dev game data from `src/data/devGameData.js` when `window.__GAME_DATA__` is not set.

## Build

- **Standard build** (multiple files, for preview or hosting):
  ```bash
  npm run build
  ```
  Output: `dist/index.html` + `dist/assets/*`. Run `npm run preview` to serve it.

- **Single-file build** (one HTML with inlined CSS, JS, and game data):
  ```bash
  npm run build:single
  ```
  Output: **`dist/game.html`**. Open this file in a browser (or host it) to play. No other files needed; game data is injected as `window.__GAME_DATA__`.

## Where game data comes from

- **Dev:** `src/data/devGameData.js` (used when `window.__GAME_DATA__` is absent). This matches the full “Share House — A Story About Yena” scenario from the original single-file game.
- **Single-file build:** The same dev data is inlined by `scripts/build-single-html.mjs`. The HTML `<title>` is set from `meta.title` and `meta.subtitle`. To ship a different game, replace the data in that script (e.g. load from a JSON file or another module) and run `npm run build:single` again.

For the exact data shape (meta, player, characters, backgrounds, scenes), see **[GAME_DATA.md](./GAME_DATA.md)**.

## Project structure

```
src/
  data/           # useGameData hook; devGameData (full Share House scenario)
  game/           # GameContext, gameReducer (state machine, ENDING_CHECK)
  screens/       # TitleScreen, GameScreen, EndingScreen
  components/     # DialogueBox, Choices, SceneBackground, CharacterPortrait, etc.
  index.css       # Global styles (from original game)
scripts/
  build-single-html.mjs   # Post-build: inlines CSS/JS + GAME_DATA → dist/game.html
```

## Tests

```bash
npm run test
```

## Future scaling

This app will later support multiple games and an authoring service where users create games. The player will then fetch game data by ID/path and may support both “single HTML per game” and “one player, many games” distribution. For now, it is acceptable to implement and ship only this one game (single HTML file). The structure and data layer are chosen so that adding multi-game support and an authoring service later does not require a full rewrite.
