import { render, screen } from '@testing-library/react';
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
