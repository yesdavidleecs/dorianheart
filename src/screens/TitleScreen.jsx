import { useGameDataContext, useGameDispatch } from '../game/GameContext';

export default function TitleScreen({ onUserInteraction }) {
  const gameData = useGameDataContext();
  const dispatch = useGameDispatch();

  function handleStart() {
    onUserInteraction?.();
    dispatch({ type: 'GO_TO_MENU' });
  }

  const confettiPositions = [
    { left: '10%', delay: 0 }, { left: '25%', delay: 2 }, { left: '45%', delay: 4 },
    { left: '65%', delay: 1 }, { left: '85%', delay: 5 }, { left: '15%', delay: 7 },
    { left: '55%', delay: 3 }, { left: '80%', delay: 6 },
  ];
  const dotStyles = [
    { top: '10%', left: '5%', size: 12 }, { top: '15%', left: '12%', size: 8 },
    { top: '5%', right: '20%', size: 16 }, { top: '10%', right: '10%', size: 8 },
    { bottom: '10%', left: '10%', size: 8 }, { bottom: '20%', right: '15%', size: 12 },
    { top: '40%', right: '10%', size: 16 }, { bottom: '40%', left: '8%', size: 12 },
  ];

  return (
    <div id="title-screen" onClick={handleStart} role="button" tabIndex={0} onKeyDown={(e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleStart(); } }}>
      <div className="vignette" />
      <div className="grain" />
      <div className="title-confetti" aria-hidden="true">
        {confettiPositions.map((p, i) => (
          <div
            key={i}
            className="title-confetti-particle"
            style={{ left: p.left, top: '-20px', animationDelay: `${p.delay}s` }}
          />
        ))}
      </div>
      <div className="title-dots" aria-hidden="true">
        {dotStyles.map((d, i) => (
          <div
            key={i}
            className="title-dot"
            style={{
              top: d.top,
              left: d.left,
              right: d.right,
              bottom: d.bottom,
              width: d.size,
              height: d.size,
            }}
          />
        ))}
      </div>
      <div className="title-content-wrap">
        <img
          className="title-logo"
          src="/customlogo.png"
          alt=""
        />
        <div className="title-text">
          <button type="button" className="title-cta" onClick={(e) => { e.stopPropagation(); handleStart(); }} onKeyDown={(e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleStart(); } }}>
            <span className="title-cta-text">Click to Play</span>
            <div className="title-cta-shimmer-bar">
              <div className="title-cta-shimmer-inner" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
