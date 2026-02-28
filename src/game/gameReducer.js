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
};

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START': {
      const { gameData } = action.payload;
      const startScene = gameData.meta.startScene;
      return {
        ...state,
        phase: 'playing',
        currentScene: startScene,
        dialogueIndex: 0,
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
      };
    }

    case 'SKIP_TYPING':
      return { ...state, isTyping: false };

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
        return { ...state, currentScene: resolved, dialogueIndex: 0 };
      }
      return state;
    }

    case 'CHOOSE': {
      const { choice, gameData } = action.payload;
      let affection = state.affection + (choice.affection || 0);
      if (affection < 0) affection = 0;
      const nextSceneId = resolveSceneId(choice.next, gameData, affection);
      const scene = gameData.scenes[nextSceneId];
      if (!scene) return { ...state, affection };
      return {
        ...state,
        affection,
        currentScene: nextSceneId,
        dialogueIndex: 0,
      };
    }

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
