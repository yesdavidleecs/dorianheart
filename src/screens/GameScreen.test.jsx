import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameDataContext, GameDispatchContext, GameStateContext } from '../game/GameContext';
import GameScreen from './GameScreen';

const mockGameData = {
  meta: { startScene: 'start' },
  characters: {
    yena: { id: 'yena', name: 'Yena', images: { default: 'https://example.com/yena.jpg' } },
  },
  backgrounds: {
    default: 'linear-gradient(red, blue)',
    custom: 'https://example.com/bg.jpg',
  },
  scenes: {
    start: {
      background: 'default',
      chapter: 'Act 1',
      character: { id: 'yena', mood: 'happy' },
      dialogue: [{ speaker: 'narrator', text: 'Hi.' }],
      next: 'end',
    },
    end: { background: 'custom', dialogue: [], next: 'start' },
  },
};

const mockDispatch = () => {};

function renderGameScreen(stateOverrides = {}) {
  const state = {
    phase: 'playing',
    currentScene: 'start',
    dialogueIndex: 0,
    affection: 10,
    ...stateOverrides,
  };
  return render(
    <GameDataContext.Provider value={mockGameData}>
      <GameStateContext.Provider value={state}>
        <GameDispatchContext.Provider value={mockDispatch}>
          <GameScreen />
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
    </GameDataContext.Provider>
  );
}

describe('GameScreen', () => {
  it('renders game screen with scene background and chapter', () => {
    const { container } = renderGameScreen();
    expect(container.querySelector('#game-screen.active')).toBeInTheDocument();
    expect(container.querySelector('#scene-bg')).toHaveStyle({ background: 'linear-gradient(red, blue)' });
    expect(screen.getByText('Act 1')).toBeInTheDocument();
  });

  it('renders character portrait with correct src and mood', () => {
    const { container } = renderGameScreen();
    const img = container.querySelector('#char-portrait');
    expect(img).toHaveAttribute('src', 'https://example.com/yena.jpg');
    expect(img.className).toContain('mood-happy');
  });

  it('renders affection hearts', () => {
    const { container } = renderGameScreen({ affection: 12 });
    const filled = container.querySelectorAll('.heart.filled');
    expect(filled).toHaveLength(2);
  });

  it('shows scene not found when currentScene is missing', () => {
    const { container } = renderGameScreen({ currentScene: 'nonexistent' });
    expect(screen.getByText('Scene not found.')).toBeInTheDocument();
  });
});
