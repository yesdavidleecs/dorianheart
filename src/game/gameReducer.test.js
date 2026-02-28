import { describe, it, expect } from 'vitest';
import {
  gameReducer,
  initialState,
  resolveEndingCheck,
  resolveSceneId,
} from './gameReducer.js';

const mockGameData = {
  meta: {
    startScene: 'start',
    affectionThresholds: { good: 18, neutral: 8 },
    endingScenes: { good: 'end_good', neutral: 'end_neutral', bad: 'end_bad' },
  },
  scenes: {
    start: { dialogue: [{ text: 'Hi' }, { text: 'Line two' }], next: 'end_bad' },
    end_good: { dialogue: [], ending: { type: 'Good', title: 'Good', text: '...' } },
    end_neutral: { dialogue: [], ending: { type: 'Neutral', title: 'Neutral', text: '...' } },
    end_bad: { dialogue: [], ending: { type: 'Bad', title: 'Bad', text: '...' } },
  },
};

describe('resolveEndingCheck', () => {
  it('returns good ending when affection >= good threshold', () => {
    expect(resolveEndingCheck(mockGameData, 18)).toBe('end_good');
    expect(resolveEndingCheck(mockGameData, 20)).toBe('end_good');
  });

  it('returns neutral ending when affection >= neutral but < good', () => {
    expect(resolveEndingCheck(mockGameData, 8)).toBe('end_neutral');
    expect(resolveEndingCheck(mockGameData, 17)).toBe('end_neutral');
  });

  it('returns bad ending when affection < neutral', () => {
    expect(resolveEndingCheck(mockGameData, 7)).toBe('end_bad');
    expect(resolveEndingCheck(mockGameData, 0)).toBe('end_bad');
  });
});

describe('resolveSceneId', () => {
  it('resolves ENDING_CHECK to correct ending by affection', () => {
    expect(resolveSceneId('ENDING_CHECK', mockGameData, 18)).toBe('end_good');
    expect(resolveSceneId('ENDING_CHECK', mockGameData, 10)).toBe('end_neutral');
    expect(resolveSceneId('ENDING_CHECK', mockGameData, 5)).toBe('end_bad');
  });

  it('returns scene id as-is when not ENDING_CHECK', () => {
    expect(resolveSceneId('start', mockGameData, 0)).toBe('start');
    expect(resolveSceneId('end_good', mockGameData, 0)).toBe('end_good');
  });
});

describe('gameReducer', () => {
  it('START sets phase to playing and loads start scene', () => {
    const state = gameReducer(initialState, {
      type: 'START',
      payload: { gameData: mockGameData },
    });
    expect(state.phase).toBe('playing');
    expect(state.currentScene).toBe('start');
    expect(state.dialogueIndex).toBe(0);
  });

  it('LOAD_SCENE sets currentScene and resets dialogueIndex', () => {
    const state = gameReducer(
      { ...initialState, phase: 'playing' },
      { type: 'LOAD_SCENE', payload: { sceneId: 'end_bad', gameData: mockGameData } }
    );
    expect(state.currentScene).toBe('end_bad');
    expect(state.dialogueIndex).toBe(0);
  });

  it('LOAD_SCENE resolves ENDING_CHECK to correct ending', () => {
    const withAffection = { ...initialState, phase: 'playing', affection: 18 };
    const state = gameReducer(withAffection, {
      type: 'LOAD_SCENE',
      payload: { sceneId: 'ENDING_CHECK', gameData: mockGameData },
    });
    expect(state.currentScene).toBe('end_good');
  });

  it('ADVANCE_DIALOGUE when typing just sets isTyping false', () => {
    const state = gameReducer(
      { ...initialState, phase: 'playing', currentScene: 'start', dialogueIndex: 0, isTyping: true },
      { type: 'ADVANCE_DIALOGUE', payload: { gameData: mockGameData } }
    );
    expect(state.isTyping).toBe(false);
    expect(state.dialogueIndex).toBe(0);
  });

  it('ADVANCE_DIALOGUE when revealed increments dialogueIndex', () => {
    const state = gameReducer(
      { ...initialState, phase: 'playing', currentScene: 'start', dialogueIndex: 0 },
      { type: 'ADVANCE_DIALOGUE', payload: { gameData: mockGameData } }
    );
    expect(state.dialogueIndex).toBe(1);
  });

  it('CHOOSE updates affection and loads next scene', () => {
    const state = gameReducer(
      { ...initialState, phase: 'playing', affection: 5 },
      {
        type: 'CHOOSE',
        payload: { choice: { text: 'Hi', affection: 3, next: 'end_bad' }, gameData: mockGameData },
      }
    );
    expect(state.affection).toBe(8);
    expect(state.currentScene).toBe('end_bad');
    expect(state.dialogueIndex).toBe(0);
  });

  it('CHOOSE does not allow affection below zero', () => {
    const state = gameReducer(
      { ...initialState, phase: 'playing', affection: 2 },
      {
        type: 'CHOOSE',
        payload: { choice: { text: 'Bad', affection: -10, next: 'end_bad' }, gameData: mockGameData },
      }
    );
    expect(state.affection).toBe(0);
  });

  it('SHOW_ENDING sets phase and ending', () => {
    const ending = { type: 'Good', title: 'Done', text: 'The end.' };
    const state = gameReducer(initialState, { type: 'SHOW_ENDING', payload: { ending } });
    expect(state.phase).toBe('ending');
    expect(state.ending).toEqual(ending);
  });
});
