import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders without crashing', () => {
  render(<App />);
});

test('App shows title screen with game title from data', () => {
  render(<App />);
  expect(screen.getByText('Share House')).toBeInTheDocument();
  expect(screen.getByText('click anywhere to begin')).toBeInTheDocument();
});
