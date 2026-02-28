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

A detailed build plan was also created at `FMV_Dating_Sim_Build_Plan.md` (available in the outputs). It covers all 7 phases with specific deliverables, risk register, and success criteria.
