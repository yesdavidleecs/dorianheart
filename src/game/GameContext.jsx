import { createContext, useContext, useReducer } from 'react';
import { useGameData } from '../data/useGameData';
import { gameReducer, initialState } from './gameReducer';

export const GameStateContext = createContext(null);
export const GameDispatchContext = createContext(null);
export const GameDataContext = createContext(null);

export function GameProvider({ children }) {
  const gameData = useGameData();
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameDataContext.Provider value={gameData}>
      <GameStateContext.Provider value={state}>
        <GameDispatchContext.Provider value={dispatch}>
          {children}
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
    </GameDataContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within GameProvider');
  return ctx;
}

export function useGameDispatch() {
  const ctx = useContext(GameDispatchContext);
  if (!ctx) throw new Error('useGameDispatch must be used within GameProvider');
  return ctx;
}

export function useGameDataContext() {
  const ctx = useContext(GameDataContext);
  if (!ctx) throw new Error('useGameDataContext must be used within GameProvider');
  return ctx;
}
