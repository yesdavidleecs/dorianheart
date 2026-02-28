import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameStateContext } from '../game/GameContext';
import EndingScreen from './EndingScreen';

describe('EndingScreen', () => {
  const mockEnding = {
    type: 'Good',
    title: 'A New Chapter',
    text: 'You got the good ending.',
  };

  beforeEach(() => {
    vi.stubGlobal('location', { reload: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders ending type, title, and text from state', () => {
    render(
      <GameStateContext.Provider value={{ ending: mockEnding }}>
        <EndingScreen />
      </GameStateContext.Provider>
    );
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('A New Chapter')).toBeInTheDocument();
    expect(screen.getByText('You got the good ending.')).toBeInTheDocument();
  });

  it('renders Play Again button', () => {
    render(
      <GameStateContext.Provider value={{ ending: mockEnding }}>
        <EndingScreen />
      </GameStateContext.Provider>
    );
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
  });

  it('calls location.reload when Play Again is clicked', () => {
    render(
      <GameStateContext.Provider value={{ ending: mockEnding }}>
        <EndingScreen />
      </GameStateContext.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('renders fallback when ending is null', () => {
    render(
      <GameStateContext.Provider value={{ ending: null }}>
        <EndingScreen />
      </GameStateContext.Provider>
    );
    expect(screen.getByText('The end.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
  });
});
