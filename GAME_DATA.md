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
| `titleCharacter` | boolean | If true, this character’s image is shown on the title screen. |
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
