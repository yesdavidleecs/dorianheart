/**
 * Affection hearts (max 5). Filled count = floor(affection / 5).
 * Label shows the name of the title character (from game data).
 */
const MAX_HEARTS = 5;

export default function AffectionDisplay({ affection, label }) {
  const filled = Math.min(MAX_HEARTS, Math.floor(affection / 5));

  return (
    <div className="affection-display visible" id="affection-display">
      {label && (
        <span id="affection-label" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.08em' }}>
          {label}
        </span>
      )}
      <div className="affection-hearts" id="affection-hearts">
        {Array.from({ length: MAX_HEARTS }, (_, i) => (
          <span
            key={i}
            className={`heart ${i < filled ? 'filled pop' : 'empty'}`}
          >
            ♥
          </span>
        ))}
      </div>
    </div>
  );
}
