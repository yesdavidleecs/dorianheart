import { useEffect, useRef } from 'react';
import { GameProvider, useGameState, useGameDispatch, useGameDataContext } from './game/GameContext';
import TitleScreen from './screens/TitleScreen';
import MenuScreen from './screens/MenuScreen';
import GameScreen from './screens/GameScreen';
import EndingScreen from './screens/EndingScreen';

const MENU_MUSIC_SRC = '/Shibuya%20Scramble.mp3';

function GameContent() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const gameData = useGameDataContext();
  const audioRef = useRef(null);
  const hasStartedMusicRef = useRef(false);

  function startMenuMusicIfNeeded() {
    if (state.phase !== 'title' && state.phase !== 'menu') return;
    if (hasStartedMusicRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => { hasStartedMusicRef.current = true; }).catch(() => {});
    } else {
      hasStartedMusicRef.current = true;
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'Space' && e.code !== 'Enter') return;
      e.preventDefault();
      if (state.phase === 'title' || state.phase === 'menu') {
        startMenuMusicIfNeeded();
      }
      if (state.phase === 'title') {
        dispatch({ type: 'GO_TO_MENU' });
      } else if (state.phase === 'playing' && !state.showLocationOverlay) {
        dispatch({ type: 'ADVANCE_DIALOGUE', payload: { gameData } });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.phase, state.showLocationOverlay, dispatch, gameData]);

  useEffect(() => {
    if (state.phase === 'title' || state.phase === 'menu') return;
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}
    }
  }, [state.phase]);

  return (
    <>
      <audio ref={audioRef} src={MENU_MUSIC_SRC} loop aria-hidden="true" />
      {state.phase === 'title' && (
        <TitleScreen onUserInteraction={startMenuMusicIfNeeded} />
      )}
      {state.phase === 'menu' && <MenuScreen />}
      {state.phase === 'playing' && <GameScreen />}
      {state.phase === 'ending' && <EndingScreen />}
    </>
  );
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
