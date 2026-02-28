import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Choices from './Choices';

describe('Choices', () => {
  it('renders nothing when choices is empty', () => {
    const { container } = render(
      <Choices choices={[]} dispatch={vi.fn()} gameData={{}} />
    );
    expect(container.querySelector('.choices-container')).toBeNull();
  });

  it('renders choice buttons with text', () => {
    const choices = [
      { text: 'Option A', affection: 5, next: 'scene_a' },
      { text: 'Option B', affection: 0, next: 'scene_b' },
    ];
    render(<Choices choices={choices} dispatch={vi.fn()} gameData={{}} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('dispatches CHOOSE with choice and gameData when a choice is clicked', () => {
    const dispatch = vi.fn();
    const gameData = { meta: {} };
    const choices = [
      { text: 'Pick me', affection: 3, next: 'next_scene' },
    ];
    render(<Choices choices={choices} dispatch={dispatch} gameData={gameData} />);
    fireEvent.click(screen.getByText('Pick me'));
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CHOOSE',
      payload: { choice: choices[0], gameData },
    });
  });
});
