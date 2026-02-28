import { useEffect } from 'react';
import { useGameState, useGameDispatch, useGameDataContext } from '../game/GameContext';
import SceneBackground from '../components/SceneBackground';
import SceneTransition from '../components/SceneTransition';
import CharacterPortrait from '../components/CharacterPortrait';
import AffectionDisplay from '../components/AffectionDisplay';
import DialogueBox from '../components/DialogueBox';
import Choices from '../components/Choices';
import HeartParticles from '../components/HeartParticles';

const LOCATION_TRANSITION_MS = 2200;

export default function GameScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const gameData = useGameDataContext();
  const scene = gameData?.scenes?.[state.currentScene];

  useEffect(() => {
    if (!state.showLocationOverlay || !scene?.location) return;
    const t = setTimeout(() => dispatch({ type: 'CLEAR_LOCATION_OVERLAY' }), LOCATION_TRANSITION_MS);
    return () => clearTimeout(t);
  }, [state.showLocationOverlay, scene?.location, dispatch]);

  // Auto-advance to next scene when current scene has no dialogue and has scene.next
  useEffect(() => {
    if (!scene || !scene.dialogue || scene.dialogue.length > 0) return;
    if (scene.choices || scene.ending) return;
    if (scene.next) {
      dispatch({ type: 'LOAD_SCENE', payload: { sceneId: scene.next, gameData } });
    }
  }, [scene, dispatch, gameData]);

  if (!scene) {
    return (
      <div id="game-screen" className="active">
        <div style={{ color: 'var(--cream)', padding: '2rem' }}>Scene not found.</div>
      </div>
    );
  }

  // During location overlay: clear screen and show only the overlay (no scene content, no input)
  if (state.showLocationOverlay) {
    return (
      <div id="game-screen" className="active">
        <SceneTransition active locationText={scene.location ?? ''} />
      </div>
    );
  }

  const dialogue = scene.dialogue ?? [];
  const inDialogue = state.dialogueIndex < dialogue.length;
  const currentLine = inDialogue ? dialogue[state.dialogueIndex] : null;
  const mood = currentLine?.mood ?? scene.character?.mood ?? 'neutral';

  const backgroundValue = scene.background ? (gameData.backgrounds?.[scene.background] ?? '') : '';
  const charData = scene.character ? gameData.characters?.[scene.character.id] : null;
  const imageSrc = charData ? (charData.images?.[scene.character?.image || 'default'] || charData.images?.default) : '';
  const titleChar = Object.values(gameData.characters || {}).find((c) => c.titleCharacter);
  const affectionLabel = titleChar?.name ?? '';
  const playerName = gameData.player?.name ?? 'Player';

  const showChoices = !inDialogue && scene.choices?.length > 0;

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
      <div className="dialogue-area" id="dialogue-area" style={{ display: showChoices ? 'none' : 'block' }}>
        {inDialogue && currentLine ? (
          <DialogueBox
            key={`${state.currentScene}-${state.dialogueIndex}`}
            line={currentLine}
            playerName={playerName}
            isTyping={state.isTyping}
            dispatch={dispatch}
            gameData={gameData}
          />
        ) : !showChoices && !scene.ending ? (
          <div
            className="dialogue-box"
            id="dialogue-box"
            role="button"
            tabIndex={0}
            onClick={() => dispatch({ type: 'ADVANCE_DIALOGUE', payload: { gameData } })}
            onKeyDown={(e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); dispatch({ type: 'ADVANCE_DIALOGUE', payload: { gameData } }); } }}
          >
            <div className="dialogue-text" id="dialogue-text">click to continue ▸</div>
          </div>
        ) : null}
      </div>
      <div style={{ display: showChoices ? 'block' : 'none' }}>
        <Choices
          choices={scene.choices}
          dispatch={dispatch}
          gameData={gameData}
        />
      </div>
      <HeartParticles spawnHearts={state.spawnHearts} dispatch={dispatch} />
    </div>
  );
}
