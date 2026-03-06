import { useState } from 'react';
import { useGameDataContext, useGameDispatch } from '../game/GameContext';

const DEFAULT_TWITTER_URL = 'https://twitter.com';

export default function MenuScreen() {
  const gameData = useGameDataContext();
  const dispatch = useGameDispatch();
  const [showSettings, setShowSettings] = useState(false);

  const twitterUrl = gameData?.meta?.twitterUrl ?? DEFAULT_TWITTER_URL;

  function handleStartGame() {
    dispatch({ type: 'START', payload: { gameData } });
  }

  function handleBack() {
    dispatch({ type: 'BACK_TO_TITLE' });
  }

  return (
    <div id="menu-screen" className="menu-screen">
      <div className="vignette" />
      <div className="grain" />
      <div className="menu-content-wrap">
        <div className="menu-left">
          <img
            className="menu-logo"
            src="/customlogo.png"
            alt=""
          />
          <nav className="menu-list" aria-label="Main menu">
            <button type="button" className="menu-item menu-item-primary" onClick={handleStartGame}>
              Start Game
            </button>
            <button type="button" className="menu-item" onClick={() => setShowSettings(true)}>
              Settings
            </button>
            <a
              className="menu-item menu-item-link"
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <button type="button" className="menu-item menu-item-back" onClick={handleBack}>
              Back
            </button>
          </nav>
        </div>
        <div className="menu-profile-wrap">
          <img
            className="menu-profile"
            src="/menuprofile.png"
            alt=""
          />
        </div>
      </div>
      {showSettings && (
        <div className="menu-settings-overlay" role="dialog" aria-label="Settings">
          <div className="menu-settings-panel">
            <h2 className="menu-settings-title">Settings</h2>
            <p className="menu-settings-placeholder">Coming soon.</p>
            <button type="button" className="menu-item" onClick={() => setShowSettings(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
