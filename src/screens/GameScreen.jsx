import { useState, useEffect } from 'react';
import { useGameState, useGameDataContext } from '../game/GameContext';
import SceneBackground from '../components/SceneBackground';
import SceneTransition from '../components/SceneTransition';
import CharacterPortrait from '../components/CharacterPortrait';
import AffectionDisplay from '../components/AffectionDisplay';

const LOCATION_TRANSITION_MS = 2200;

export default function GameScreen() {
  const state = useGameState();
  const gameData = useGameDataContext();
  const scene = gameData?.scenes?.[state.currentScene];
  const [locationOverlayActive, setLocationOverlayActive] = useState(false);

  useEffect(() => {
    if (scene?.location) {
      setLocationOverlayActive(true);
      const t = setTimeout(() => setLocationOverlayActive(false), LOCATION_TRANSITION_MS);
      return () => clearTimeout(t);
    }
    setLocationOverlayActive(false);
  }, [state.currentScene, scene?.location]);

  if (!scene) {
    return (
      <div id="game-screen" className="active">
        <div style={{ color: 'var(--cream)', padding: '2rem' }}>Scene not found.</div>
      </div>
    );
  }

  const backgroundValue = scene.background ? (gameData.backgrounds?.[scene.background] ?? '') : '';
  const charData = scene.character ? gameData.characters?.[scene.character.id] : null;
  const imageSrc = charData ? (charData.images?.[scene.character?.image || 'default'] || charData.images?.default) : '';
  const mood = scene.character?.mood || 'neutral';
  const titleChar = Object.values(gameData.characters || {}).find((c) => c.titleCharacter);
  const affectionLabel = titleChar?.name ?? '';

  return (
    <div id="game-screen" className="active">
      <SceneBackground backgroundValue={backgroundValue} />
      <div className="scene-bg-overlay" />
      <div className="scene-grain" />
      <div className="scene-indicator" id="scene-indicator">
        {scene.chapter ?? ''}
      </div>
      <AffectionDisplay affection={state.affection} label={affectionLabel} />
      <CharacterPortrait
        character={scene.character}
        imageSrc={imageSrc}
        mood={mood}
      />
      <div className="dialogue-area" id="dialogue-area" style={{ display: 'block' }}>
        <div className="dialogue-box" id="dialogue-box">
          <div className="speaker-name" id="speaker-name">—</div>
          <div className="dialogue-text" id="dialogue-text">(Dialogue in Step 6)</div>
          <div className="click-indicator" id="click-indicator">click to continue ▸</div>
        </div>
      </div>
      <div className="choices-container" id="choices-container" style={{ display: 'none' }}>
        (Choices in Step 7)
      </div>
      <SceneTransition active={locationOverlayActive} locationText={scene.location ?? ''} />
    </div>
  );
}
