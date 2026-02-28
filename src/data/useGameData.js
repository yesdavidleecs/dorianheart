import { devGameData } from './devGameData.js';

/**
 * Returns GAME_DATA: from window.__GAME_DATA__ in production (single-HTML build),
 * or devGameData when not set (local dev).
 */
export function useGameData() {
  if (typeof window !== 'undefined' && window.__GAME_DATA__) {
    return window.__GAME_DATA__;
  }
  return devGameData;
}
