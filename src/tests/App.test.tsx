import { render, screen } from '@testing-library/react';
import App from '../components/App';

test('renders the hero heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /danial endrawes/i })).toBeInTheDocument();
});
