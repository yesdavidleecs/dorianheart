import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DialogueBox from './DialogueBox';

describe('DialogueBox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders speaker name and resolves $PLAYER to playerName', async () => {
    const dispatch = vi.fn();
    render(
      <DialogueBox
        line={{ speaker: '$PLAYER', text: 'Hi there.' }}
        playerName="David"
        isTyping={false}
        dispatch={dispatch}
        gameData={{}}
      />
    );
    expect(screen.getByText('David')).toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(500); });
    expect(screen.getByText('Hi there.')).toBeInTheDocument();
  });

  it('renders narrator with narrator class and no name', async () => {
    const dispatch = vi.fn();
    const { container } = render(
      <DialogueBox
        line={{ speaker: 'narrator', text: 'Narrator line.' }}
        playerName="Player"
        isTyping={false}
        dispatch={dispatch}
        gameData={{}}
      />
    );
    const nameEl = container.querySelector('.speaker-name.narrator');
    expect(nameEl).toBeInTheDocument();
    expect(nameEl).toHaveTextContent('');
    await act(async () => { vi.advanceTimersByTime(500); });
    expect(screen.getByText('Narrator line.')).toBeInTheDocument();
  });

  it('reveals text over time (typewriter)', async () => {
    const dispatch = vi.fn();
    render(
      <DialogueBox
        line={{ speaker: 'Yena', text: 'Hi' }}
        playerName="Player"
        isTyping={false}
        dispatch={dispatch}
        gameData={{}}
      />
    );
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TYPING', payload: true });
    await act(async () => { vi.advanceTimersByTime(30); });
    expect(screen.getByText('H')).toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(30); });
    expect(screen.getByText('Hi')).toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(30); });
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TYPING', payload: false });
  });

  it('dispatches ADVANCE_DIALOGUE when clicked and not typing', async () => {
    const dispatch = vi.fn();
    const gameData = { meta: {} };
    render(
      <DialogueBox
        line={{ speaker: 'Yena', text: 'Done.' }}
        playerName="Player"
        isTyping={false}
        dispatch={dispatch}
        gameData={gameData}
      />
    );
    await act(async () => { vi.advanceTimersByTime(200); });
    const box = screen.getByRole('button');
    fireEvent.click(box);
    expect(dispatch).toHaveBeenCalledWith({ type: 'ADVANCE_DIALOGUE', payload: { gameData } });
  });

  it('skips to full text and sets typing false when clicked while typing', () => {
    const dispatch = vi.fn();
    render(
      <DialogueBox
        line={{ speaker: 'Yena', text: 'Hello world' }}
        playerName="Player"
        isTyping={true}
        dispatch={dispatch}
        gameData={{}}
      />
    );
    const box = screen.getByRole('button');
    fireEvent.click(box);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TYPING', payload: false });
  });
});
