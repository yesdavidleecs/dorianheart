import { useEffect } from 'react';
import { GameProvider, useGameState, useGameDispatch, useGameDataContext } from './game/GameContext';
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';

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
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.phase, dispatch, gameData]);

  if (state.phase === 'title') {
    return <TitleScreen />;
  }
  if (state.phase === 'playing') {
    return <GameScreen />;
  }
  if (state.phase === 'ending') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--cream)' }}>
        Ending screen (Step 8.)
      </div>
    );
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
