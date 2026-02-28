import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import HeartParticles from './HeartParticles';

describe('HeartParticles', () => {
  it('renders nothing when spawnHearts is 0', () => {
    const { container } = render(
      <HeartParticles spawnHearts={0} dispatch={vi.fn()} />
    );
    expect(container.querySelectorAll('.heart-particle')).toHaveLength(0);
  });

  it('renders heart particles when spawnHearts > 0', () => {
    const { container } = render(
      <HeartParticles spawnHearts={3} dispatch={vi.fn()} />
    );
    expect(container.querySelectorAll('.heart-particle')).toHaveLength(3);
  });

  it('caps at 5 particles', () => {
    const { container } = render(
      <HeartParticles spawnHearts={10} dispatch={vi.fn()} />
    );
    expect(container.querySelectorAll('.heart-particle')).toHaveLength(5);
  });

  it('dispatches CLEAR_SPAWN_HEARTS after duration', async () => {
    vi.useFakeTimers();
    const dispatch = vi.fn();
    render(<HeartParticles spawnHearts={2} dispatch={dispatch} />);
    expect(dispatch).not.toHaveBeenCalled();
    await act(async () => { vi.advanceTimersByTime(1500); });
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_SPAWN_HEARTS' });
    vi.useRealTimers();
  });
});
