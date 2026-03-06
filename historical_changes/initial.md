# Initial documentation (consolidated)

Contents of all markdown files as of the creation of the `historical-changes` folder. Each section below is the original file in full.

---

## Original: README.md

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

- **Dev:** `src/data/devGameData.js` (used when `window.__GAME_DATA__` is absent). This matches the full "Share House — A Story About Yena" scenario from the original single-file game.
- **Single-file build:** The same dev data is inlined by `scripts/build-single-html.mjs`. The HTML `<title>` is set from `meta.title` and `meta.subtitle`. To ship a different game, replace the data in that script (e.g. load from a JSON file or another module) and run `npm run build:single` again.

For the exact data shape (meta, player, characters, backgrounds, scenes), see **GAME_DATA.md** (now in this folder as part of initial.md).

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

This app will later support multiple games and an authoring service where users create games. The player will then fetch game data by ID/path and may support both "single HTML per game" and "one player, many games" distribution. For now, it is acceptable to implement and ship only this one game (single HTML file). The structure and data layer are chosen so that adding multi-game support and an authoring service later does not require a full rewrite.

---

## Original: PROJECT_HANDOFF.md

# FMV Dating Simulator Generator — Project Handoff

## What This Project Is

A web app/tool that lets an average person upload photos of friends, write short bios, and get a **playable FMV (Full Motion Video) dating simulator** — inspired by Korean FMV games like **하숙생이 전부 미녀입니다만** (All My Housemates Are Beautiful). Real photos, K-drama storytelling, branching choices, affection tracking, multiple endings. Runs entirely in-browser as a single HTML file.

## Key Design Decisions Made

### Why FMV style (not anime/cartoon)?
- The reference game (하숙생) uses real actors and photo stills with text overlays, not anime art
- Style transfer / AI image generation would destroy the FMV feel
- Real photos with CSS K-drama color grading filters (warm tones, soft focus, vignette, film grain) is the right approach
- The game is essentially a **photo novel** — photo stills + dialogue + choices

### Architecture: Template + LLM Hybrid
We evaluated ~15 high-level approaches and chose:
- **Template skeleton** for story structure (K-drama act beats guarantee good pacing)
- **LLM (Claude API)** fills in personalized dialogue, character voice, branching choices
- **CSS/Canvas filters** for photo processing (not AI image gen)
- **React state machine** as game engine (no external VN engine)
- **Single HTML file output** — self-contained, shareable, zero install

### Why this approach wins
- Matches FMV aesthetic without video production
- Lowest friction for average users (upload photos + bios → playable game)
- Templates prevent incoherent AI storytelling; LLM keeps it personalized
- HTML5 = instant shareability (critical for virality)
- K-drama template library is a moat

## What Exists So Far

### Working Files

**Location on local machine:** `/Users/devlee/Projects/datesim/`

1. **`game_v2.html`** — The main deliverable. A fully playable, self-contained FMV dating sim with:
   - Complete game engine (state machine, typewriter text, scene transitions, affection tracking, branching, multiple endings)
   - Clean separation between **`GAME_DATA`** (content) and **`Engine`** (code)
   - Yena's photo embedded as base64 inside the GAME_DATA
   - K-drama CSS aesthetics (frosted glass dialogue box, mood filters, heart particles, film grain, vignette)
   - Keyboard support (Space/Enter to advance)
   - Mobile responsive
   - ~527KB total

2. **`game.html`** — The v1 prototype (same story but engine and data are intermingled, not separated). Kept for reference but `game_v2.html` supersedes it.

### Architecture of game_v2.html

The file has two clearly separated sections:

```
GAME_DATA (JSON object) — ALL content lives here
├── meta         → title, subtitle, startScene, affectionThresholds, endingScenes
├── player       → { name, image }
├── characters   → { id, name, bio, archetype, images: { default, ... } }
├── backgrounds  → { key: CSS gradient string | URL | data URI }
└── scenes       → Full story graph
    └── each scene has:
        ├── background   → key from backgrounds
        ├── location     → optional location card text
        ├── chapter      → chapter label
        ├── character    → { id, mood } — who's on screen
        ├── dialogue     → [{ speaker, text }] — "$PLAYER" = player name
        ├── choices      → [{ text, affection, next }]
        ├── next         → auto-advance scene ID, or "ENDING_CHECK"
        └── ending       → { type, title, text } — triggers ending screen

Engine (JS object) — reads GAME_DATA, runs the game. Never needs to change.
├── init()            → sets up title screen from meta + characters
├── start()           → transition from title to gameplay
├── loadScene(id)     → loads scene, handles ENDING_CHECK routing
├── applyScene()      → sets background, character portrait, mood filter
├── showDialogueLine() → typewriter effect, narrator vs character styling
├── advanceDialogue() → click/tap/keyboard handler
├── showChoices()     → renders choice buttons
├── makeChoice()      → applies affection delta, spawns hearts, advances
├── updateAffection() → renders heart meter
└── showEnding()      → fade to ending screen
```

**To create a completely different game**, you only replace `GAME_DATA`. The engine runs it automatically.

### The Demo Game: "Share House — A Story About Yena"

**Settings chosen:**
- Setting: Share House (하숙생 style)
- Characters: 1 dateable character (Yena)
- Player: David (faceless protagonist)
- Language: English
- Personality: Mysterious & Reserved
- Romance style: Slow burn
- Length: Medium (~10 scenes)

**Character:**
- **Yena** — 28-year-old from Korea, just moved to SF. Reads in the library, plays with her dog Mochi, enjoys a light beer after a long day.
- Photo: uploaded by user (embedded as base64 in game_v2.html)

**Story structure (7 chapters, 10+ scenes, 3 endings):**

```
ACT 1: First Impressions
  1_arrival → 1_first_meeting (3 choices) → warm/cold/quiet response

ACT 2: Growing Closer
  2_morning (2 choices) → book_talk / shared_silence

ACT 3: Getting Closer
  3_dog_park (2 choices) → play_dog / tease_yena

ACT 4: Vulnerability
  4_convenience_store (3 choices) → rooftop_beers (2 choices) / dismiss
    → rooftop_close / rooftop_words

ACT 5: Turning Point
  5_kitchen_close / 5_kitchen_distance (based on Act 4 choices)

ACT 6: Deepening
  6_library (2 choices) → notebook / quiet_together

ACT 7: Confession
  7_rooftop_confession (3 choices) → let_go / ask_stay / hold_hand
    → ENDING_CHECK (routes based on total affection score)

ENDINGS:
  Good (affection >= 18): "A New Chapter" — Yena stays, freelances from SF
  Neutral (affection >= 8): "The Distance Between" — Yena leaves but stays connected
  Bad (affection < 8): "Unread Pages" — Yena leaves without goodbye
```

**Mood system:** Each scene sets a character mood that applies a CSS filter:
- `neutral` — slightly desaturated, warm sepia
- `happy` — warmer, brighter
- `sad` — desaturated, darker, cool
- `flustered` — saturated, warm hue shift
- `serious` — desaturated, high contrast
- `angry` — high saturation, high contrast, warm hue

**Special tokens in dialogue:**
- `$PLAYER` in speaker field → replaced with `GAME_DATA.player.name` at runtime
- `narrator` in speaker field → italic gold styling, no name shown

## What Hasn't Been Built Yet

### Next priority: Auto-generator pipeline
The current game was hand-written. The next step is building a pipeline that:
1. Takes user input (photos + bios + setting + preferences)
2. Calls Claude API to generate the `GAME_DATA` JSON
3. Embeds photos as base64
4. Outputs a playable HTML file

### Full roadmap from the build plan:
| Phase | Status | Description |
|-------|--------|-------------|
| 0: Architecture | ✅ Done | Tech stack + data model |
| 1: Story Templates | ✅ Done (1 template) | Share house template built into demo |
| 2: LLM Pipeline | ❌ Not started | Claude API → scene graph JSON |
| 3: Visual Layer | ✅ Done | React-like component system in vanilla JS |
| 4: Game Engine | ✅ Done | State machine, branching, affection |
| 5: Character Creation UX | ❌ Not started | Upload wizard / onboarding flow |
| 6: Integration | ❌ Not started | End-to-end pipeline |
| 7: Stretch Goals | ❌ Not started | Party mode, TTS, sharing |

### Stretch goals discussed:
- Party Mode (group photo → 60sec mini-game)
- TTS voice acting (ElevenLabs / OpenAI TTS)
- Music generation per scene mood
- Multi-language support (KR/EN/JP)
- Video clip support for true FMV
- Character "texting" mini-game (fake iMessage UI)
- Photo booth mode
- Community template marketplace
- Multiplayer mode (friends compare choices)

## Technical Notes

- Backgrounds are currently CSS gradients (not real photos) — could be upgraded to stock photos or user-uploaded location images
- The character `images` dict supports multiple keys (e.g., `default`, `smile`, `angry`) for different expression photos, but the demo only uses `default` since we only have one photo
- The engine supports multiple characters (the `characters` dict can have many entries) — the demo just uses one
- `affectionThresholds` in meta controls ending routing — easily tunable
- The entire file is vanilla HTML/CSS/JS with no framework dependencies

## Build Plan Document

A detailed build plan was also created at `FMV_Dating_Sim_Build_Plan.md` (available in this document below). It covers all 7 phases with specific deliverables, risk register, and success criteria.

---

## Original: GAME_DATA.md

# GAME_DATA contract

This document describes the shape of `GAME_DATA` consumed by the player. Use it when authoring a new game or wiring the single-file build.

The player reads `GAME_DATA` from `window.__GAME_DATA__` (single-file build) or from `src/data/devGameData.js` in development when `window.__GAME_DATA__` is not set.

---

## Top-level shape

```js
{
  meta: { ... },
  player: { ... },
  characters: { ... },
  backgrounds: { ... },
  scenes: { ... }
}
```

---

## `meta`

| Field | Type | Description |
|-------|------|--------------|
| `title` | string | Game title (title screen and page title). |
| `subtitle` | string | Subtitle on title screen. |
| `startScene` | string | Scene id to load when the player clicks "Start". |
| `affectionThresholds` | `{ good: number, neutral: number }` | Affection values used when `next` is `"ENDING_CHECK"`: ≥ good → good ending, ≥ neutral → neutral ending, else bad ending. |
| `endingScenes` | `{ good: string, neutral: string, bad: string }` | Scene ids for the three endings. |

---

## `player`

| Field | Type | Description |
|-------|------|--------------|
| `name` | string | Display name for the protagonist. Shown when dialogue uses speaker `"$PLAYER"`. |

---

## `characters`

Object keyed by character id. Each character:

| Field | Type | Description |
|-------|------|--------------|
| `id` | string | Same as key. |
| `name` | string | Display name in dialogue. |
| `titleCharacter` | boolean | If true, this character's image is shown on the title screen. |
| `images` | `{ [mood?: string]: string }` | Image URLs or data URIs. Use key `default` for the default portrait; optional keys (e.g. `neutral`, `happy`, `sad`, `flustered`, `serious`) for mood-specific images. |

---

## `backgrounds`

Object keyed by background id. Values are CSS background values (e.g. `linear-gradient(...)` or image URLs). Scenes reference them by id in `scene.background`.

---

## `scenes`

Object keyed by scene id. Each scene can have:

| Field | Type | Description |
|-------|------|--------------|
| `background` | string | Key from `backgrounds`. |
| `location` | string (optional) | Shown as location card on transition. |
| `chapter` | string (optional) | Chapter label. |
| `character` | `{ id: string, mood?: string }` (optional) | Who is on screen; `id` from `characters`, `mood` used for image and CSS class. |
| `dialogue` | array | `{ speaker: string, text: string }[]`. See below. |
| `choices` | array (optional) | `{ text: string, affection: number, next: string }[]`. If present, shown after dialogue; one choice is picked per branch. |
| `next` | string (optional) | Next scene id after dialogue (and after choices if no choices). |
| `ending` | object (optional) | If present, triggers ending screen. `{ type: string, title: string, text: string }`. |

**Dialogue speakers**

- `"narrator"` — narration (no character name).
- `"$PLAYER"` — replaced with `player.name`.
- Any other string (e.g. `"Yena"`) — character name as-is (usually matches `characters[id].name`).

**Special `next` value**

- `"ENDING_CHECK"` — engine resolves to one of `meta.endingScenes.good | neutral | bad` using current affection and `meta.affectionThresholds`.

---

## Example (minimal)

```js
{
  meta: {
    title: 'My Game',
    subtitle: 'A short story',
    startScene: 'start',
    affectionThresholds: { good: 10, neutral: 5 },
    endingScenes: { good: 'end_good', neutral: 'end_neutral', bad: 'end_bad' }
  },
  player: { name: 'Alex' },
  characters: {
    lead: { id: 'lead', name: 'Jordan', titleCharacter: true, images: { default: 'https://…' } }
  },
  backgrounds: { room: 'linear-gradient(180deg, #333 0%, #666 100%)' },
  scenes: {
    start: {
      background: 'room',
      dialogue: [
        { speaker: 'narrator', text: 'You enter the room.' },
        { speaker: '$PLAYER', text: 'Hello?' },
        { speaker: 'Jordan', text: 'Hi.' }
      ],
      choices: [
        { text: 'Smile.', affection: 2, next: 'good_path' },
        { text: 'Leave.', affection: -1, next: 'bad_path' }
      ]
    },
    good_path: { background: 'room', dialogue: [ … ], next: 'ENDING_CHECK' },
    bad_path:  { background: 'room', dialogue: [ … ], next: 'ENDING_CHECK' },
    end_good:   { background: 'room', dialogue: [ … ], ending: { type: 'Good', title: '…', text: '…' } },
    end_neutral: { … },
    end_bad:    { … }
  }
}
```

---

## Reference implementation

The full scenario used in dev and in the single-file build is in `src/data/devGameData.js` (same story as the original `game_v2.html`).

---

## Original: DUAL_CODEBASE_APPROACH.md

# Dual Codebase Approach: Player + Authoring

This document describes how to structure the **game/player** codebase using React, assuming a dual codebase setup: this repo is the **player** that consumes `GAME_DATA` produced by a separate **authoring** app.

---

## 1. Where `GAME_DATA` Lives

The player doesn't "own" the story data; the authoring app provides it. Options:

| Approach | How it works | When to use |
|----------|--------------|-------------|
| **Build-time injection** | Authoring outputs an HTML that embeds `window.__GAME_DATA__ = { ... }` and loads your React bundle. React reads `window.__GAME_DATA__` on mount. | Single-file export: one HTML that "is" the game. |
| **JSON file** | Build produces `game.json` + `index.html` that loads the bundle; bundle fetches `game.json`. | When you're okay with two files (HTML + JSON). |
| **URL / query** | `?data=https://.../game.json` and the player fetches that URL. | Hosted games, multiple games from one player build. |

For "share one file," build-time injection into a single HTML is the usual approach.

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

Use Option A if you want screens and game-specific components front and center; use Option B if you prefer "context / hooks / components" separation and might reuse UI elsewhere.

---

## 3. State: Where to Put It and How to Shape It

Game state is a small state machine. Two clean options:

### A. Single `GameContext` + `useReducer` (recommended)

- One context holds: `phase`, `currentScene`, `dialogueIndex`, `affection`, `isTyping`, `currentText`, `typingTimeoutRef`, and optionally `ending`.
- A reducer handles: `START`, `LOAD_SCENE`, `ADVANCE_DIALOGUE`, `SKIP_TYPING`, `CHOOSE`, `SHOW_ENDING`, etc.
- Logic that today lives in `Engine` (e.g. `ENDING_CHECK` resolution, "next scene") can live in the reducer or in a `useGameEngine` that returns `[state, dispatch]` and handles keyboard.

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

- **App**: Renders by `phase` → `TitleScreen` | `GameScreen` | `EndingScreen`. Wraps with `GameDataProvider` (GAME_DATA) and `GameStateProvider` (game state + dispatch). Subscribes to keyboard (Space/Enter) and calls the same "advance" / "start" actions as clicks.
- **TitleScreen**: Reads `meta` and title character from context; onClick dispatches `START` (or calls `start()` from context).
- **GameScreen**: Reads current scene from state; renders `SceneBackground`, `SceneTransition` (if location), `CharacterPortrait`, `AffectionDisplay`, `DialogueBox` or `Choices`, and (when needed) `HeartParticles`. All read from game state + GAME_DATA.
- **DialogueBox**: Receives current line (from state + `GAME_DATA.scenes[state.currentScene].dialogue[state.dialogueIndex]`). Runs typewriter in `useEffect` (clear on unmount / when line changes). onClick dispatches `ADVANCE_DIALOGUE` (or skip-typing then advance).
- **Choices**: Maps over `scene.choices`; each button dispatches `CHOOSE(choice)` (affection + next scene).
- **EndingScreen**: Renders `ending.type/title/text` and "Play Again" (e.g. `location.reload()` or dispatch `RESTART` if you support in-memory restart).

GAME_DATA can be provided once at the top (e.g. from `window.__GAME_DATA__` in `useGameData` or a provider), and the rest of the app only uses context (and optionally a small `useGameEngine` that encapsulates reducer + ENDING_CHECK logic).

---

## 5. Typewriter and Side Effects

- Keep typewriter in **one place** (e.g. inside `DialogueBox` or a small `useTypewriter(text, speed, onComplete)`).
- Store "currently displayed length" or "full text + revealed" in state so that "click to skip" just sets "reveal full" and then advance.
- Use `useEffect` + cleanup (clear timeouts/intervals) when the line or scene changes so you don't get overlapping typewriters.

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

---

## Original: FMV_Dating_Sim_Build_Plan.md

# FMV Dating Simulator Generator — Build Plan

## Vision
A web app where an average person uploads photos of friends + writes short bios → gets a playable, shareable FMV-style dating simulator inspired by Korean FMV games like 하숙생이 전부 미녀입니다만. Real photos, K-drama storytelling, branching choices, affection tracking, multiple endings.

---

## Phase 0: Core Architecture Decisions

### Tech Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React (single-page app) | Component-based, good for state-heavy game UI |
| Game Engine | Custom React state machine | VN engines are overkill; we need photo display + branching text + state tracking |
| Story Generation | Claude API (Sonnet) | Best at structured creative writing, can output JSON scene graphs |
| Image Processing | Canvas API + CSS filters | K-drama color grading (warm tones, soft glow, vignette) applied client-side |
| Hosting | Static HTML5 export | Shareable via link, zero install |
| Data Format | JSON scene graph | Portable, inspectable, easy to edit |

### Key Data Model
```
Game {
  characters: Character[]
  scenes: Scene[]
  variables: { affection: Record<characterId, number>, flags: Record<string, boolean> }
}

Character {
  id, name, bio, personality_archetype, photo_url
}

Scene {
  id, background, dialogue: DialogueLine[], choices?: Choice[]
}

DialogueLine {
  character_id, text, expression?, animation?
}

Choice {
  text, effects: { affection_delta?, set_flag? }, next_scene_id
}
```

---

## Phase 1: Story Template Engine (Week 1)

**Goal:** Build the narrative skeleton that guarantees good pacing regardless of LLM output quality.

### 1.1 Define the K-Drama Act Structure
Create a story template schema based on Korean drama / share-house dating sim conventions:

```
ACT 1 — First Impressions (3-4 scenes)
  ├── Scene: Arrival / Moving In
  ├── Scene: Meeting Character A (first impression + choice)
  ├── Scene: Meeting Character B (contrast with A)
  └── Scene: Group dinner / shared moment (establish dynamics)

ACT 2 — Growing Closer (4-5 scenes per route)
  ├── Scene: One-on-one event with chosen character
  ├── Scene: Jealousy / tension moment
  ├── Scene: Vulnerable confession or shared secret
  ├── Scene: Misunderstanding / conflict
  └── Scene: Reconciliation + affection gate check

ACT 3 — Climax & Resolution (2-3 scenes per route)
  ├── Scene: Love triangle confrontation OR big romantic gesture
  ├── Scene: Final choice (commit to one character)
  └── Scene: Ending (Good / Neutral / Bad based on affection score)
```

### 1.2 Build Template Variants
Create 3 setting packs, each with location-appropriate scene prompts:
- **Share House** (하숙생 style): kitchen encounters, rooftop at night, bathroom scheduling conflicts
- **University Campus**: library study sessions, festival prep, café after class
- **Workplace / Office**: break room tension, after-work drinks, project crunch bonding

### 1.3 Deliverable
A JSON schema and 3 complete template skeletons (setting × act structure) with placeholder slots for character names, dialogue, and choices.

---

## Phase 2: LLM Story Generation Pipeline (Week 1-2)

**Goal:** Fill template slots with personalized, character-aware dialogue using Claude.

### 2.1 Prompt Engineering

Design a multi-step generation pipeline:

**Step 1 — Character Profile Expansion**
```
Input:  { name: "Jake", bio: "sarcastic but secretly sweet", photo_description: "tall, glasses, messy hair" }
Output: { personality_archetype: "tsundere", speech_style: "dry humor, short sentences, occasional sincerity that catches you off guard", interests: [...], secret: "..." }
```

**Step 2 — Scene Dialogue Generation**
```
Input:  template_scene + expanded_character_profiles + current_affection_state
Output: { dialogue_lines: [...], choices: [...with affection_deltas...] }
```

**Step 3 — Ending Generation**
```
Input:  chosen_route_character + affection_score + key_flags_set
Output: { ending_type: "good"|"neutral"|"bad", final_scene_dialogue: [...] }
```

### 2.2 Output Format Contract
All LLM outputs must conform to the JSON scene graph schema. Use structured output prompting:
```
"Respond ONLY in JSON matching this schema. No markdown, no preamble. { scenes: [...] }"
```

### 2.3 Quality Guardrails
- Validate JSON output, retry on failure (max 2 retries)
- Enforce max dialogue line length (keep it punchy — FMV games use short lines)
- Check that affection deltas are balanced (no single choice should lock you into a route in Act 1)
- Tone consistency check: re-prompt if character voice drifts from established archetype

### 2.4 Deliverable
A working Node.js / Python script that takes (characters[] + setting + template) → complete playable scene graph JSON.

---

## Phase 3: FMV Visual Presentation Layer (Week 2)

**Goal:** Make real photos feel like a polished Korean FMV dating sim.

### 3.1 Photo Processing Pipeline

**On Upload:**
1. Face detection (browser-side via face-api.js or MediaPipe) — crop to consistent portrait aspect ratio
2. Apply K-drama color grading via CSS/Canvas:
   - Warm color temperature shift (+15% warm)
   - Soft gaussian blur on background (depth of field fake)
   - Subtle vignette (darker edges)
   - Slight bloom/glow on highlights
   - Film grain overlay (very subtle)
3. Generate expression variants (stretch goal):
   - Apply subtle CSS transforms for "expressions" (slight zoom for intensity, tilt for curiosity, etc.)

**Asset Generation:**
- Each character gets 1 base photo processed into 3 "moods" via filter variations:
  - **Neutral:** base processing
  - **Happy:** warmer tones, slight brightness boost
  - **Serious/Sad:** cooler tones, desaturated, slight dark vignette

### 3.2 Scene Composition

Layout inspired by actual FMV dating sims:
```
┌─────────────────────────────────┐
│         BACKGROUND IMAGE        │  ← location photo (blurred/dimmed)
│                                 │
│     ┌───────────────────┐       │
│     │  CHARACTER PHOTO   │      │  ← K-drama filtered portrait, centered
│     │   (large, focal)   │      │
│     └───────────────────┘       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Name                        │ │  ← dialogue box (semi-transparent)
│ │ "Dialogue text appears      │ │
│ │  here with typewriter fx"   │ │
│ └─────────────────────────────┘ │
│                                 │
│   [ Choice A ]  [ Choice B ]   │  ← when applicable
└─────────────────────────────────┘
```

### 3.3 UI/UX Polish

- **Typewriter text effect** for dialogue (essential VN feel)
- **Fade transitions** between scenes (CSS opacity + transform)
- **Character slide-in** animations when a character "enters" a scene
- **Screen shake** for dramatic moments
- **Heart particle effect** on affection-raising choices
- **Affection meter UI** — subtle heart icons or bar in corner
- **BGM integration** — royalty-free lo-fi / K-drama OST style ambient audio (optional, toggle)
- **Save/Load state** via in-memory state (or URL hash for shareability)

### 3.4 Typography & Theming
- Font: Noto Sans KR (if Korean) or a clean sans-serif with a handwritten accent font for character names
- Color palette: warm cream backgrounds, soft pink/coral accents, dark text
- Dialogue box: frosted glass effect (backdrop-filter: blur)

### 3.5 Deliverable
A React component library: `<GameScreen>`, `<DialogueBox>`, `<CharacterPortrait>`, `<ChoiceMenu>`, `<AffectionMeter>`, `<SceneTransition>`.

---

## Phase 4: Game State Machine (Week 2)

**Goal:** Wire everything together into a playable branching experience.

### 4.1 State Machine Design

```
States: TITLE → CHARACTER_SETUP → PLAYING → ENDING → CREDITS

PLAYING sub-states:
  DIALOGUE    → advance on click/tap
  CHOICE      → wait for selection
  TRANSITION  → animate scene change
  AFFECTION_CHECK → gate check for route locks
```

### 4.2 Core Game Loop
```javascript
function advanceGame(state, action) {
  switch (action.type) {
    case 'ADVANCE_DIALOGUE':
      // Move to next line, or next scene if dialogue exhausted
    case 'MAKE_CHOICE':
      // Apply affection deltas, set flags, jump to next_scene_id
    case 'CHECK_ROUTE':
      // Compare affection scores, determine which Act 2/3 branch
  }
}
```

### 4.3 Route Logic
- After Act 1, route is determined by highest affection character
- Ties broken by most recent choice
- Bad ending triggered if all affection scores below threshold
- "Secret" ending if specific flag combination is met (easter egg)

### 4.4 Deliverable
A `useGameEngine` React hook that manages the full state machine, exposes current scene/dialogue/choices, and handles branching logic.

---

## Phase 5: Character Creation UX (Week 3)

**Goal:** The upload + bio flow that makes the "average person" feel like a game designer.

### 5.1 Onboarding Flow
```
Screen 1: "Create Your Dating Sim 💕"
  → Pick setting: [Share House] [University] [Office]

Screen 2: "Add Your Characters" (min 2, max 4)
  → For each character:
     [Upload Photo]
     [Name: __________ ]
     [One-line bio: _________________________ ]
     [Pick a vibe: 😏 Flirty | 🤫 Mysterious | 😊 Sweet | 😤 Tsundere | 🤓 Nerdy ]

Screen 3: "Your character" (the player)
  → [Your name: ________]
  → [Upload your photo (optional)]

Screen 4: "Generating your game..." (loading screen with K-drama style preview)
  → Show character cards being "assembled" with animations
  → Progress: "Writing your story..." → "Setting the scene..." → "Adding drama..."

Screen 5: Game launches!
```

### 5.2 Smart Defaults
- If user doesn't pick a vibe → infer from bio keywords
- If user doesn't upload player photo → use silhouette/generic avatar
- If bio is empty → generate one from the vibe selection
- Pre-fill fun placeholder text: "e.g., 'My roommate who always steals my leftovers'"

### 5.3 Deliverable
Complete onboarding wizard React component with photo upload, form validation, and API call to story generation.

---

## Phase 6: Integration & Polish (Week 3-4)

### 6.1 End-to-End Pipeline
```
User Input → Photo Processing → LLM Story Generation → Scene Graph Assembly → Game Renderer
```

### 6.2 Loading & Error States
- Skeleton loading screens with K-drama aesthetic
- Retry logic for LLM failures
- Fallback to template-only dialogue if LLM times out

### 6.3 Sharing
- "Share your game" button → generates a URL with encoded game state (or hosted JSON)
- Social preview card with character photos + game title
- "Play again with different choices" restart option

### 6.4 Mobile Optimization
- Touch-friendly tap targets
- Portrait-first layout (most people will share/play on phones)
- Swipe gestures for dialogue advancement

### 6.5 Deliverable
Fully playable prototype. Upload photos → play a 10-15 minute dating sim → share with friends.

---

## Phase 7: Stretch Goals (Post-MVP)

| Feature | Effort | Impact |
|---------|--------|--------|
| Party Mode (group photo → 60sec mini-game) | Medium | 🔥 Viral potential |
| TTS voice acting (ElevenLabs / OpenAI TTS) | Medium | Huge immersion boost |
| Music generation (Suno/Udio) per scene mood | Low | Atmosphere |
| Multi-language support (KR/EN/JP) | Low | Market expansion |
| Video clip support (upload short clips) | High | True FMV |
| Character "texting" mini-game (fake iMessage UI) | Medium | Very K-drama |
| Photo booth mode (take photos in-app) | Low | Mobile-native flow |
| Community template marketplace | High | Long-term platform play |
| Multiplayer mode (friends play same story, compare) | High | Social/party game |

---

## Timeline Summary

| Phase | Week | Deliverable |
|-------|------|-------------|
| 0: Architecture | — | Tech stack + data model locked |
| 1: Story Templates | 1 | 3 setting templates with act structures |
| 2: LLM Pipeline | 1-2 | Script → scene graph JSON generator |
| 3: Visual Layer | 2 | React component library with FMV aesthetics |
| 4: Game Engine | 2 | State machine + branching logic |
| 5: Character UX | 3 | Onboarding wizard |
| 6: Integration | 3-4 | End-to-end playable prototype |
| 7: Stretch | 4+ | Party mode, TTS, sharing |

---

## Risk Register

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| LLM generates incoherent/off-tone dialogue | Medium | Strong templates as guardrails + retry logic |
| Photo quality varies wildly | High | Aggressive CSS filtering normalizes look |
| JSON parsing failures from LLM | Medium | Structured output prompting + validation + retry |
| Game too short / lacks depth | Medium | Aim for 10-15 min playtime, 2 routes minimum |
| Slow generation time | Medium | Stream responses, show loading with character previews |
| Players find it uncanny/awkward | Low-Med | Lean into the charm — FMV games embrace this |

---

## Success Criteria for Prototype
1. ✅ User can upload 2-3 photos + bios and get a playable game in under 2 minutes
2. ✅ Game has minimum 8 scenes with 4+ meaningful choices
3. ✅ At least 2 distinct routes with different endings
4. ✅ Photos look polished with K-drama color grading
5. ✅ Runs entirely in browser, shareable via link
6. ✅ Someone who's never coded can use it start to finish
