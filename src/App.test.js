import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the app title', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /quick estimate calculator/i })).toBeInTheDocument();
});

test('shows an error when calculate is clicked with empty input', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /calculate estimate/i }));

  expect(screen.getByText(/please enter service hours/i)).toBeInTheDocument();
});

test('displays the correct total after entering valid hours', () => {
  render(<App />);
  fireEvent.change(screen.getByRole('spinbutton', { name: /service hours/i }), {
    target: { value: '3' },
  });
  fireEvent.click(screen.getByRole('button', { name: /calculate estimate/i }));

  expect(screen.getByText('$225')).toBeInTheDocument();
});

test('saves an estimate to history and prevents duplicate saves', () => {
  render(<App />);
  fireEvent.change(screen.getByRole('spinbutton', { name: /service hours/i }), {
    target: { value: '4' },
  });
  fireEvent.click(screen.getByRole('button', { name: /calculate estimate/i }));
  fireEvent.click(screen.getByRole('button', { name: /save estimate/i }));

  expect(screen.getByText(/4 hr at \$75\/hr/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /estimate saved/i })).toBeDisabled();
});

test('clears a stale total when the input changes after calculation', () => {
  render(<App />);
  const hoursInput = screen.getByRole('spinbutton', { name: /service hours/i });

  fireEvent.change(hoursInput, { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: /calculate estimate/i }));
  expect(screen.getByText('$150')).toBeInTheDocument();

  fireEvent.change(hoursInput, { target: { value: '5' } });
  expect(screen.queryByText('$150')).not.toBeInTheDocument();
});
