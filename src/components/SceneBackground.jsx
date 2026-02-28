/**
 * Renders the scene background from GAME_DATA.backgrounds[scene.background].
 * Supports URL, data URI, or CSS gradient string.
 */
export default function SceneBackground({ backgroundValue }) {
  if (!backgroundValue) {
    return <div className="scene-bg" id="scene-bg" />;
  }
  const isUrl = typeof backgroundValue === 'string' && (backgroundValue.startsWith('http') || backgroundValue.startsWith('data:'));
  const style = isUrl
    ? { background: `url(${backgroundValue}) center/cover` }
    : { background: backgroundValue };

  return (
    <div className="scene-bg" id="scene-bg" style={style} />
  );
}
