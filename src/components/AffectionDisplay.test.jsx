import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AffectionDisplay from './AffectionDisplay';

describe('AffectionDisplay', () => {
  it('renders 5 hearts', () => {
    const { container } = render(<AffectionDisplay affection={0} />);
    const hearts = container.querySelectorAll('.affection-hearts .heart');
    expect(hearts).toHaveLength(5);
  });

  it('renders filled hearts based on affection (floor(affection/5))', () => {
    const { container } = render(<AffectionDisplay affection={12} />);
    const filled = container.querySelectorAll('.heart.filled');
    const empty = container.querySelectorAll('.heart.empty');
    expect(filled).toHaveLength(2);
    expect(empty).toHaveLength(3);
  });

  it('caps at 5 filled hearts', () => {
    const { container } = render(<AffectionDisplay affection={100} />);
    const filled = container.querySelectorAll('.heart.filled');
    expect(filled).toHaveLength(5);
  });

  it('renders label when provided', () => {
    render(<AffectionDisplay affection={0} label="Yena" />);
    expect(screen.getByText('Yena')).toBeInTheDocument();
  });
});
