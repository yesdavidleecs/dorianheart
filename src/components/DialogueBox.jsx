import { useState, useEffect, useRef } from 'react';

const TYPEWRITER_SPEED_MS = 30;

export default function DialogueBox({ line, playerName, isTyping, dispatch, gameData }) {
  const [visibleLength, setVisibleLength] = useState(0);
  const timeoutRef = useRef(null);

  const fullText = line?.text ?? '';
  const revealed = visibleLength >= fullText.length;

  useEffect(() => {
    if (!line) return;
    dispatch({ type: 'SET_TYPING', payload: true });

    let len = 0;
    function tick() {
      if (len < fullText.length) {
        len += 1;
        setVisibleLength(len);
        timeoutRef.current = setTimeout(tick, TYPEWRITER_SPEED_MS);
      } else {
        dispatch({ type: 'SET_TYPING', payload: false });
      }
    }
    if (fullText.length > 0) {
      timeoutRef.current = setTimeout(tick, TYPEWRITER_SPEED_MS);
    } else {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      dispatch({ type: 'SET_TYPING', payload: false });
    };
  }, []); // Parent uses key to remount when line changes

  const speakerName = line?.speaker === '$PLAYER' ? (playerName ?? 'Player') : (line?.speaker ?? '');
  const isNarrator = speakerName === 'narrator';
  const displayText = fullText.slice(0, visibleLength);

  function handleClick() {
    if (isTyping) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisibleLength(fullText.length);
      dispatch({ type: 'SET_TYPING', payload: false });
    } else {
      dispatch({ type: 'ADVANCE_DIALOGUE', payload: { gameData } });
    }
  }

  return (
    <div className="dialogue-box" id="dialogue-box" onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleClick(); } }}>
      <div
        className={`speaker-name ${isNarrator ? 'narrator' : ''}`}
        id="speaker-name"
      >
        {isNarrator ? '' : speakerName}
      </div>
      <div className="dialogue-text" id="dialogue-text">
        {displayText}
        {revealed ? null : <span className="cursor" />}
      </div>
      <div className={`click-indicator ${revealed ? 'visible' : ''}`} id="click-indicator">
        click to continue ▸
      </div>
    </div>
  );
}
