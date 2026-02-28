/**
 * Character portrait with mood filter. Hidden when scene has no character.
 */
export default function CharacterPortrait({ character, imageSrc, mood }) {
  if (!character) {
    return (
      <div className="character-container hidden" id="char-container">
        <img className="character-portrait mood-neutral" id="char-portrait" alt="" src="" />
      </div>
    );
  }
  const moodClass = mood || 'neutral';
  return (
    <div className="character-container" id="char-container">
      <img
        className={`character-portrait entering mood-${moodClass}`}
        id="char-portrait"
        src={imageSrc || ''}
        alt=""
      />
    </div>
  );
}
