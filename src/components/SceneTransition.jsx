/**
 * Full-screen location card overlay. Shown when entering a scene with scene.location.
 * active: whether the overlay is visible (e.g. for 2.2s after scene load).
 */
export default function SceneTransition({ active, locationText }) {
  return (
    <div className={`scene-transition ${active ? 'active' : ''}`} id="scene-transition">
      <div className="location-text" id="location-text">
        {locationText ?? ''}
      </div>
    </div>
  );
}
