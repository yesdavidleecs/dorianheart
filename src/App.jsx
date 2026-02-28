import { useEffect } from 'react';
import { GameProvider, useGameState, useGameDispatch, useGameDataContext } from './game/GameContext';
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import EndingScreen from './screens/EndingScreen';

function GameContent() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const gameData = useGameDataContext();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'Space' && e.code !== 'Enter') return;
      e.preventDefault();
      if (state.phase === 'title') {
        dispatch({ type: 'START', payload: { gameData } });
      } else if (state.phase === 'playing' && !state.showLocationOverlay) {
        dispatch({ type: 'ADVANCE_DIALOGUE', payload: { gameData } });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.phase, state.showLocationOverlay, dispatch, gameData]);

  if (state.phase === 'title') {
    return <TitleScreen />;
  }
  if (state.phase === 'playing') {
    return <GameScreen />;
  }
  if (state.phase === 'ending') {
    return <EndingScreen />;
  }

  return null;
}

function App() {
  return (
    <GameProvider>
      <div id="game">
        <GameContent />
      </div>
    </GameProvider>
  );
}

export default App;
