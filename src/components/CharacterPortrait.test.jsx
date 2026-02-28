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
});
