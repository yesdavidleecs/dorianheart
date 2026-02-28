/**
 * Resolves ENDING_CHECK to the actual ending scene id based on affection.
 */
export function resolveEndingCheck(gameData, affection) {
  const { affectionThresholds, endingScenes } = gameData.meta;
  if (affection >= affectionThresholds.good) return endingScenes.good;
  if (affection >= affectionThresholds.neutral) return endingScenes.neutral;
  return endingScenes.bad;
}

/**
 * Resolves scene id: if ENDING_CHECK, resolve via gameData and affection; else return as-is.
 */
export function resolveSceneId(sceneId, gameData, affection) {
  if (sceneId === 'ENDING_CHECK') {
    return resolveEndingCheck(gameData, affection);
  }
  return sceneId;
}

export const initialState = {
  phase: 'title',
  currentScene: null,
  dialogueIndex: 0,
  affection: 0,
  isTyping: false,
  currentText: '',
  ending: null,
  spawnHearts: 0,
  showLocationOverlay: false,
};

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START': {
      const { gameData } = action.payload;
      const startScene = gameData.meta.startScene;
      const startSceneData = gameData.scenes[startScene];
      return {
        ...state,
        phase: 'playing',
        currentScene: startScene,
        dialogueIndex: 0,
        showLocationOverlay: !!startSceneData?.location,
      };
    }

    case 'LOAD_SCENE': {
      const { sceneId, gameData } = action.payload;
      const resolved = resolveSceneId(sceneId, gameData, state.affection);
      const scene = gameData.scenes[resolved];
      if (!scene) return state;
      return {
        ...state,
        currentScene: resolved,
        dialogueIndex: 0,
        showLocationOverlay: !!scene?.location,
      };
    }

    case 'SKIP_TYPING':
      return { ...state, isTyping: false };

    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };

    case 'ADVANCE_DIALOGUE': {
      const { gameData } = action.payload;
      if (state.isTyping) {
        return { ...state, isTyping: false };
      }
      const scene = gameData?.scenes?.[state.currentScene];
      const nextIndex = state.dialogueIndex + 1;
      if (!scene || nextIndex < scene.dialogue.length) {
        return { ...state, dialogueIndex: nextIndex };
      }
      if (scene.choices) {
        return { ...state, dialogueIndex: nextIndex };
      }
      if (scene.ending) {
        return {
          ...state,
          phase: 'ending',
          ending: scene.ending,
          dialogueIndex: nextIndex,
        };
      }
      if (scene.next) {
        const resolved = resolveSceneId(scene.next, gameData, state.affection);
        const nextScene = gameData.scenes[resolved];
        return {
          ...state,
          currentScene: resolved,
          dialogueIndex: 0,
          showLocationOverlay: !!nextScene?.location,
        };
      }
      return state;
    }

    case 'CHOOSE': {
      const { choice, gameData } = action.payload;
      let affection = state.affection + (choice.affection || 0);
      if (affection < 0) affection = 0;
      const nextSceneId = resolveSceneId(choice.next, gameData, affection);
      const scene = gameData.scenes[nextSceneId];
      const spawnHearts = choice.affection > 0 ? Math.min(choice.affection, 5) : 0;
      if (!scene) return { ...state, affection, spawnHearts };
      return {
        ...state,
        affection,
        currentScene: nextSceneId,
        dialogueIndex: 0,
        spawnHearts,
        showLocationOverlay: !!scene?.location,
      };
    }

    case 'CLEAR_LOCATION_OVERLAY':
      return { ...state, showLocationOverlay: false };

    case 'CLEAR_SPAWN_HEARTS':
      return { ...state, spawnHearts: 0 };

    case 'SHOW_ENDING':
      return {
        ...state,
        phase: 'ending',
        ending: action.payload.ending,
      };

    default:
      return state;
  }
}
