import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameDataContext, GameDispatchContext, GameStateContext } from '../game/GameContext';
import TitleScreen from './TitleScreen';

const mockGameData = {
  meta: { title: 'Test Game', subtitle: 'A Test Subtitle' },
  characters: {
    hero: {
      id: 'hero',
      name: 'Hero',
      titleCharacter: true,
      images: { default: 'https://example.com/hero.jpg' },
    },
  },
};

function renderWithMockContext() {
  const mockDispatch = vi.fn();
  return {
    mockDispatch,
    ...render(
      <GameDataContext.Provider value={mockGameData}>
        <GameStateContext.Provider value={{ phase: 'title' }}>
          <GameDispatchContext.Provider value={mockDispatch}>
            <TitleScreen />
          </GameDispatchContext.Provider>
        </GameStateContext.Provider>
      </GameDataContext.Provider>
    ),
  };
}

describe('TitleScreen', () => {
  it('renders title and subtitle from game data', () => {
    const mockDispatch = vi.fn();
    render(
      <GameDataContext.Provider value={mockGameData}>
        <GameStateContext.Provider value={{ phase: 'title' }}>
          <GameDispatchContext.Provider value={mockDispatch}>
            <TitleScreen />
          </GameDispatchContext.Provider>
        </GameStateContext.Provider>
      </GameDataContext.Provider>
    );

    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('A Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('click anywhere to begin')).toBeInTheDocument();
  });

  it('renders title character image with correct src', () => {
    const mockDispatch = vi.fn();
    const { container } = render(
      <GameDataContext.Provider value={mockGameData}>
        <GameStateContext.Provider value={{ phase: 'title' }}>
          <GameDispatchContext.Provider value={mockDispatch}>
            <TitleScreen />
          </GameDispatchContext.Provider>
        </GameStateContext.Provider>
      </GameDataContext.Provider>
    );

    const img = container.querySelector('.title-photo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/hero.jpg');
  });

  it('dispatches START with gameData when clicked', () => {
    const { mockDispatch, container } = renderWithMockContext();
    const titleScreen = container.querySelector('#title-screen');
    fireEvent.click(titleScreen);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'START', payload: { gameData: mockGameData } });
  });
});
