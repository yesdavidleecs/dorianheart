import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameDataContext, GameDispatchContext, GameStateContext } from '../game/GameContext';
import MenuScreen from './MenuScreen';

const mockGameData = {
  meta: {
    title: 'Test Game',
    twitterUrl: 'https://twitter.com/testgame',
  },
  characters: {},
};

function renderWithMockContext(gameData = mockGameData) {
  const mockDispatch = vi.fn();
  return {
    mockDispatch,
    ...render(
      <GameDataContext.Provider value={gameData}>
        <GameStateContext.Provider value={{ phase: 'menu' }}>
          <GameDispatchContext.Provider value={mockDispatch}>
            <MenuScreen />
          </GameDispatchContext.Provider>
        </GameStateContext.Provider>
      </GameDataContext.Provider>
    ),
  };
}

describe('MenuScreen', () => {
  it('renders Start Game, Settings, Twitter, and Back', () => {
    renderWithMockContext();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('dispatches START with gameData when Start Game is clicked', () => {
    const { mockDispatch } = renderWithMockContext();
    fireEvent.click(screen.getByText('Start Game'));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'START', payload: { gameData: mockGameData } });
  });

  it('dispatches BACK_TO_TITLE when Back is clicked', () => {
    const { mockDispatch } = renderWithMockContext();
    fireEvent.click(screen.getByText('Back'));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'BACK_TO_TITLE' });
  });

  it('Twitter link uses twitterUrl from gameData.meta', () => {
    renderWithMockContext();
    const link = screen.getByRole('link', { name: 'Twitter' });
    expect(link).toHaveAttribute('href', 'https://twitter.com/testgame');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('Twitter link falls back to default when twitterUrl is missing', () => {
    const gameDataWithoutTwitter = { meta: { title: 'Test' }, characters: {} };
    renderWithMockContext(gameDataWithoutTwitter);
    const link = screen.getByRole('link', { name: 'Twitter' });
    expect(link).toHaveAttribute('href', 'https://twitter.com');
  });

  it('opens Settings overlay when Settings is clicked', () => {
    renderWithMockContext();
    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Coming soon.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument();
  });
});
