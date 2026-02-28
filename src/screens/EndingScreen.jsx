import { useGameState } from '../game/GameContext';

export default function EndingScreen() {
  const { ending } = useGameState();

  if (!ending) {
    return (
      <div id="ending-screen" className="active">
        <div className="ending-text">The end.</div>
        <button type="button" className="restart-btn" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div id="ending-screen" className="active">
      <div className="ending-type" id="ending-type">
        {ending.type}
      </div>
      <div className="ending-title" id="ending-title">
        {ending.title}
      </div>
      <div className="ending-text" id="ending-text">
        {ending.text}
      </div>
      <button type="button" className="restart-btn" onClick={() => window.location.reload()}>
        Play Again
      </button>
    </div>
  );
}
