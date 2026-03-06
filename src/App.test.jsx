import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('App renders without crashing', () => {
  render(<App />);
});

test('App shows title screen with logo and Click to Play', () => {
  render(<App />);
  expect(screen.getByText('Click to Play')).toBeInTheDocument();
  const logo = document.querySelector('.title-logo');
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute('src', '/customlogo.png');
});

test('App shows menu after Click to Play, then game after Start Game', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Click to Play'));
  expect(screen.getByText('Start Game')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument();
  fireEvent.click(screen.getByText('Start Game'));
  expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
});
