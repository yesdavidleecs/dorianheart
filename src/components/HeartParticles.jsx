import { useEffect, useState } from 'react';

const PARTICLE_DURATION_MS = 1500;

function makeParticles(count) {
  const n = Math.min(count, 5);
  return Array.from({ length: n }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    left: `${40 + Math.random() * 20}%`,
    top: `${50 + Math.random() * 20}%`,
    color: `hsl(${350 + Math.random() * 20}, 70%, ${65 + Math.random() * 15}%)`,
  }));
}

/**
 * Renders floating heart particles when spawnHearts > 0.
 * Dispatches CLEAR_SPAWN_HEARTS after duration so state resets.
 */
export default function HeartParticles({ spawnHearts, dispatch }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (spawnHearts > 0) {
      setParticles(makeParticles(spawnHearts));
      const t = setTimeout(() => {
        dispatch({ type: 'CLEAR_SPAWN_HEARTS' });
        setParticles([]);
      }, PARTICLE_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [spawnHearts, dispatch]);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="heart-particle"
          style={{ left: p.left, top: p.top, color: p.color }}
        >
          ♥
        </div>
      ))}
    </>
  );
}
