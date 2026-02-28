import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders without crashing', () => {
  render(<App />);
});

test('App contains FMV Dating Sim', () => {
  render(<App />);
  expect(screen.getByText('FMV Dating Sim')).toBeInTheDocument();
});
