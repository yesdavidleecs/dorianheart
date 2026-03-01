import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CharacterPortrait from './CharacterPortrait';

describe('CharacterPortrait', () => {
  it('renders hidden container when character is null', () => {
    const { container } = render(<CharacterPortrait character={null} imageSrc="" mood="neutral" />);
    const wrap = container.querySelector('#char-container.hidden');
    expect(wrap).toBeInTheDocument();
  });

  it('renders portrait with correct src and mood class when character provided', () => {
    const { container } = render(
      <CharacterPortrait character={{ id: 'yena' }} imageSrc="https://example.com/yena.jpg" mood="happy" />
    );
    const wrap = container.querySelector('#char-container:not(.hidden)');
    const img = container.querySelector('#char-portrait');
    expect(wrap).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/yena.jpg');
    expect(img.className).toContain('mood-happy');
  });

  it('uses neutral mood when mood not provided', () => {
    const { container } = render(
      <CharacterPortrait character={{ id: 'yena' }} imageSrc="/img.jpg" />
    );
    const img = container.querySelector('#char-portrait');
    expect(img.className).toContain('mood-neutral');
  });

  it('renders video element with correct attributes when imageSrc is .mp4', () => {
    const { container } = render(
      <CharacterPortrait character={{ id: 'yena' }} imageSrc="/yena_smile.mp4" mood="neutral" />
    );
    const video = container.querySelector('#char-portrait');
    expect(video?.tagName).toBe('VIDEO');
    expect(video).toHaveAttribute('src', '/yena_smile.mp4');
    expect(video.autoplay).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.className).toContain('mood-neutral');
  });
});
