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
  it('renders logo and Click to Play', () => {
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

    expect(screen.getByText('Click to Play')).toBeInTheDocument();
    const logo = document.querySelector('.title-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/customlogo.png');
  });

  it('dispatches START with gameData when clicked', () => {
    const { mockDispatch, container } = renderWithMockContext();
    const titleScreen = container.querySelector('#title-screen');
    fireEvent.click(titleScreen);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'START', payload: { gameData: mockGameData } });
  });

  it('dispatches START when Click to Play button is clicked', () => {
    const { mockDispatch, container } = renderWithMockContext();
    const ctaButton = container.querySelector('.title-cta');
    fireEvent.click(ctaButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'START', payload: { gameData: mockGameData } });
  });
});
