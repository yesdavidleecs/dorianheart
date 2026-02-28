import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SceneBackground from './SceneBackground';

describe('SceneBackground', () => {
  it('renders div with scene-bg class', () => {
    const { container } = render(<SceneBackground backgroundValue="" />);
    const bg = container.querySelector('#scene-bg.scene-bg');
    expect(bg).toBeInTheDocument();
  });

  it('applies CSS gradient as background style when value is not URL', () => {
    const value = 'linear-gradient(180deg, red 0%, blue 100%)';
    const { container } = render(<SceneBackground backgroundValue={value} />);
    const bg = container.querySelector('#scene-bg');
    expect(bg).toHaveStyle({ background: value });
  });

  it('applies url() background when value starts with http', () => {
    const value = 'https://example.com/bg.jpg';
    const { container } = render(<SceneBackground backgroundValue={value} />);
    const bg = container.querySelector('#scene-bg');
    expect(bg).toHaveStyle({ background: `url(${value}) center/cover` });
  });

  it('applies url() background when value starts with data:', () => {
    const value = 'data:image/png;base64,abc';
    const { container } = render(<SceneBackground backgroundValue={value} />);
    const bg = container.querySelector('#scene-bg');
    expect(bg).toHaveStyle({ background: `url(${value}) center/cover` });
  });
});
