import { useGameDataContext, useGameDispatch } from '../game/GameContext';

export default function TitleScreen() {
  const gameData = useGameDataContext();
  const dispatch = useGameDispatch();
  const { meta, characters } = gameData;
  const titleChar = Object.values(characters || {}).find((c) => c.titleCharacter);

  function handleStart() {
    dispatch({ type: 'START', payload: { gameData } });
  }

  return (
    <div id="title-screen" onClick={handleStart} role="button" tabIndex={0} onKeyDown={(e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleStart(); } }}>
      <div className="vignette" />
      <div className="grain" />
      {titleChar && (
        <img
          className="title-photo"
          id="title-photo"
          src={titleChar.images?.default}
          alt=""
        />
      )}
      <div className="title-text">
        <h1 id="game-title">{meta?.title ?? ''}</h1>
        <div className="subtitle" id="game-subtitle">{meta?.subtitle ?? ''}</div>
        <div className="start-hint">click anywhere to begin</div>
      </div>
    </div>
  );
}
