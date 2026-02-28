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
