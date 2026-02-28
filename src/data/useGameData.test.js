import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameData } from './useGameData';

describe('useGameData', () => {
  const originalGAME_DATA = window.__GAME_DATA__;

  afterEach(() => {
    if (originalGAME_DATA !== undefined) {
      window.__GAME_DATA__ = originalGAME_DATA;
    } else {
      delete window.__GAME_DATA__;
    }
  });

  it('returns window.__GAME_DATA__ when set', () => {
    window.__GAME_DATA__ = { meta: { title: 'Test Game' } };
    const { result } = renderHook(() => useGameData());
    expect(result.current.meta.title).toBe('Test Game');
  });

  it('returns devGameData when window.__GAME_DATA__ is not set', () => {
    delete window.__GAME_DATA__;
    const { result } = renderHook(() => useGameData());
    expect(result.current.meta.title).toBe('Share House');
    expect(result.current.meta.startScene).toBe('1_arrival');
  });
});
