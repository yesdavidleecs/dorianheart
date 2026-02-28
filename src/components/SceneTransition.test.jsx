import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SceneTransition from './SceneTransition';

describe('SceneTransition', () => {
  it('renders location text when provided', () => {
    render(<SceneTransition active={true} locationText="Downtown" />);
    expect(screen.getByText('Downtown')).toBeInTheDocument();
  });

  it('has active class when active is true', () => {
    const { container } = render(<SceneTransition active={true} locationText="Here" />);
    const el = container.querySelector('.scene-transition.active');
    expect(el).toBeInTheDocument();
  });

  it('does not have active class when active is false', () => {
    const { container } = render(<SceneTransition active={false} locationText="There" />);
    const el = container.querySelector('.scene-transition.active');
    expect(el).toBeNull();
  });
});
