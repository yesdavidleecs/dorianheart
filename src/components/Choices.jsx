/**
 * Renders choice buttons. Each click dispatches CHOOSE(choice) with gameData.
 */
export default function Choices({ choices, dispatch, gameData }) {
  if (!choices?.length) return null;

  return (
    <div className="choices-container" id="choices-container" style={{ display: 'flex' }}>
      {choices.map((choice, i) => (
        <button
          key={i}
          type="button"
          className="choice-btn"
          style={{ animationDelay: `${i * 0.12}s` }}
          onClick={() => dispatch({ type: 'CHOOSE', payload: { choice, gameData } })}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
