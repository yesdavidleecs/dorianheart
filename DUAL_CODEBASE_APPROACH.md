# Dual Codebase Approach: Player + Authoring

This document describes how to structure the **game/player** codebase using React, assuming a dual codebase setup: this repo is the **player** that consumes `GAME_DATA` produced by a separate **authoring** app.

---

## 1. Where `GAME_DATA` Lives

The player doesn’t “own” the story data; the authoring app provides it. Options:

| Approach | How it works | When to use |
|----------|--------------|-------------|
| **Build-time injection** | Authoring outputs an HTML that embeds `window.__GAME_DATA__ = { ... }` and loads your React bundle. React reads `window.__GAME_DATA__` on mount. | Single-file export: one HTML that “is” the game. |
| **JSON file** | Build produces `game.json` + `index.html` that loads the bundle; bundle fetches `game.json`. | When you’re okay with two files (HTML + JSON). |
| **URL / query** | `?data=https://.../game.json` and the player fetches that URL. | Hosted games, multiple games from one player build. |

For “share one file,” build-time injection into a single HTML is the usual approach.

---

## 2. Suggested Folder Structure

Two variants: **by feature/screen** (good for this game) and **by type** (good if you add many shared primitives).

### Option A — By feature/screen (recommended)

```
src/
  index.jsx                 # entry, render <App />
  index.css                 # global resets, :root, body
  App.jsx                   # phase + GameProvider, keyboard
  data/
    useGameData.js          # read GAME_DATA (window or context)
  game/
    GameContext.jsx         # game state + actions (scene, dialogueIndex, affection, etc.)
    useGameEngine.js        # optional: pure logic / reducer helpers
  screens/
    TitleScreen.jsx         # meta + title character, click to start
    GameScreen.jsx          # layout: scene + portrait + dialogue + choices
    EndingScreen.jsx        # ending type/title/text + restart
  components/
    SceneBackground.jsx     # background from GAME_DATA.backgrounds
    SceneTransition.jsx     # location card with animation
    CharacterPortrait.jsx   # image + mood class
    DialogueBox.jsx         # speaker, typewriter text, click-to-continue
    Choices.jsx             # list of choice buttons
    AffectionDisplay.jsx    # hearts from state.affection
    HeartParticles.jsx      # transient hearts (portal or state-driven)
  styles/
    title.css
    game.css
    dialogue.css
    ...                     # or one game.css, or CSS modules
```

### Option B — By type

```
src/
  index.jsx
  App.jsx
  context/
    GameDataContext.jsx
    GameStateContext.jsx
  hooks/
    useGameData.js
    useGameEngine.js
  components/
    ui/           # shared UI
    game/         # TitleScreen, GameScreen, EndingScreen, Scene*, DialogueBox, Choices, AffectionDisplay, HeartParticles
  data/
    (GAME_DATA injection point or loader)
  styles/
```

Use Option A if you want screens and game-specific components front and center; use Option B if you prefer “context / hooks / components” separation and might reuse UI elsewhere.

---

## 3. State: Where to Put It and How to Shape It

Game state is a small state machine. Two clean options:

### A. Single `GameContext` + `useReducer` (recommended)

- One context holds: `phase`, `currentScene`, `dialogueIndex`, `affection`, `isTyping`, `currentText`, `typingTimeoutRef`, and optionally `ending`.
- A reducer handles: `START`, `LOAD_SCENE`, `ADVANCE_DIALOGUE`, `SKIP_TYPING`, `CHOOSE`, `SHOW_ENDING`, etc.
- Logic that today lives in `Engine` (e.g. `ENDING_CHECK` resolution, “next scene”) can live in the reducer or in a `useGameEngine` that returns `[state, dispatch]` and handles keyboard.

### B. Zustand (or similar) store

- Same state shape, but in a store. Good if you want to avoid prop/context drilling and keep the component tree shallow.
- For this size of app, context + useReducer is usually enough.

### State shape (conceptual)

```js
// state
{
  phase: 'title' | 'playing' | 'ending',
  currentScene: string | null,
  dialogueIndex: number,
  affection: number,
  isTyping: boolean,
  currentText: string,
  ending: { type, title, text } | null,
  // optional: location card visibility for transition
}
```

---

## 4. Component Tree and Data Flow

- **App**: Renders by `phase` → `TitleScreen` | `GameScreen` | `EndingScreen`. Wraps with `GameDataProvider` (GAME_DATA) and `GameStateProvider` (game state + dispatch). Subscribes to keyboard (Space/Enter) and calls the same “advance” / “start” actions as clicks.
- **TitleScreen**: Reads `meta` and title character from context; onClick dispatches `START` (or calls `start()` from context).
- **GameScreen**: Reads current scene from state; renders `SceneBackground`, `SceneTransition` (if location), `CharacterPortrait`, `AffectionDisplay`, `DialogueBox` or `Choices`, and (when needed) `HeartParticles`. All read from game state + GAME_DATA.
- **DialogueBox**: Receives current line (from state + `GAME_DATA.scenes[state.currentScene].dialogue[state.dialogueIndex]`). Runs typewriter in `useEffect` (clear on unmount / when line changes). onClick dispatches `ADVANCE_DIALOGUE` (or skip-typing then advance).
- **Choices**: Maps over `scene.choices`; each button dispatches `CHOOSE(choice)` (affection + next scene).
- **EndingScreen**: Renders `ending.type/title/text` and “Play Again” (e.g. `location.reload()` or dispatch `RESTART` if you support in-memory restart).

GAME_DATA can be provided once at the top (e.g. from `window.__GAME_DATA__` in `useGameData` or a provider), and the rest of the app only uses context (and optionally a small `useGameEngine` that encapsulates reducer + ENDING_CHECK logic).

---

## 5. Typewriter and Side Effects

- Keep typewriter in **one place** (e.g. inside `DialogueBox` or a small `useTypewriter(text, speed, onComplete)`).
- Store “currently displayed length” or “full text + revealed” in state so that “click to skip” just sets “reveal full” and then advance.
- Use `useEffect` + cleanup (clear timeouts/intervals) when the line or scene changes so you don’t get overlapping typewriters.

---

## 6. Styling

- **One CSS file** (e.g. `game.css`): copy your current `<style>` into it and import in `index.jsx`. Easiest migration.
- **CSS modules** (e.g. `DialogueBox.module.css`): scope per component; good if you want to avoid clashes and keep styles next to components.
- **Styled-components / Emotion**: only if you prefer co-located JS-driven styles; not required for this size.

Keeping your existing K-drama CSS (variables, dialogue box, moods, particles) and just attaching class names from React (e.g. `mood-${scene.character.mood}`) is enough.

---

## 7. Single-HTML Export (Dual Codebase)

- **Authoring app** (separate repo/app): produces a **single HTML file** that:
  - Inlines or links one CSS file.
  - Inlines a script that sets `window.__GAME_DATA__ = { ... }` (with base64 images).
  - Loads your player bundle (or inlines it): e.g. `<script src="player.js">` from a CDN or inline.
- **Player (this codebase)**: Vite build → `dist/player.js` (and optional `player.css`). It does **not** embed GAME_DATA; it reads `window.__GAME_DATA__` (or a small wrapper that falls back to a dev/default JSON). So one player build can run any game the authoring app emits.

**Summary:** This codebase = React app that assumes `GAME_DATA` is provided (e.g. by the authoring app at build time via `window`). Structure = feature-based folders + one game context + reducer + screens/components as above.
