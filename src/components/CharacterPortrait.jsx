function isVideoSrc(src) {
  if (!src || typeof src !== 'string') return false;
  const lower = src.toLowerCase();
  return lower.endsWith('.mp4') || lower.endsWith('.webm');
}

/**
 * Character portrait with mood filter. Hidden when scene has no character.
 * Renders <video> for .mp4/.webm assets (autoPlay, muted, loop, playsInline); otherwise <img>.
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
  const portraitClass = `character-portrait entering mood-${moodClass}`;
  const isVideo = isVideoSrc(imageSrc);

  return (
    <div className="character-container" id="char-container">
      {isVideo ? (
        <video
          className={portraitClass}
          id="char-portrait"
          src={imageSrc || ''}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          className={portraitClass}
          id="char-portrait"
          src={imageSrc || ''}
          alt=""
        />
      )}
    </div>
  );
}
