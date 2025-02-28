import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock localStorage for tests
beforeAll(() => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

// Mock router since our app uses it
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({ id: 'bitcoin' }),
}));

// Update the test to match what's actually in your app
test('renders app navigation', () => {
  render(<App />);
  const navElement = screen.getByText(/CryptoTracker/i);
  expect(navElement).toBeInTheDocument();
});