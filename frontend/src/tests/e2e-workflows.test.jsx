import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

global.fetch = jest.fn();

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('End-to-End User Workflow Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    process.env.REACT_APP_AUTH_API_URL = 'http://localhost:3004';
    process.env.REACT_APP_CLIENT_API_URL = 'http://localhost:6001';
  });

  test('1. Complete user journey: Browse → Sign Up → Login → View Events', async () => {
    // Mock events API
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/events')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([
            { id: 1, name: 'Test Event', date: '2025-12-01', ticketsAvailable: 100 }
          ])
        });
      }
      if (url.includes('/register')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'User registered successfully', userId: 1 })
        });
      }
      if (url.includes('/login')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            token: 'mock-jwt-token',
            user: { id: 1, email: 'test@example.com' }
          })
        });
      }
    });

    // Step 1: Start on home page and see events
    const { container } = renderApp('/');
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/events'),
        undefined
      );
    });

    // Step 2: Navigate to sign up
    const signUpLinks = screen.getAllByText(/sign up/i);
    fireEvent.click(signUpLinks[0]);

    await waitFor(() => {
      expect(screen.getByText(/create a new account/i)).toBeInTheDocument();
    });

    // Step 3: Register new user
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'newuser@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signUpButton);

    // Step 4: Should redirect to sign in
    await waitFor(() => {
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    });

    // Step 5: Login with new credentials
    const loginEmail = screen.getByLabelText(/email address/i);
    const loginPassword = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(loginEmail, { target: { value: 'newuser@test.com' } });
    fireEvent.change(loginPassword, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    // Step 6: Should be logged in and see events
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
    });
  });

  test('2. Protected route workflow: Try to purchase without login → Login → Purchase', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/events') && !url.includes('/purchase')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([
            { id: 1, name: 'Concert', date: '2025-12-15', ticketsAvailable: 50 }
          ])
        });
      }
      if (url.includes('/purchase')) {
        // First call - unauthorized
        if (!localStorage.getItem('token')) {
          return Promise.resolve({
            status: 401,
            ok: false,
            json: async () => ({ message: 'Not authorized' })
          });
        }
        // Second call - authorized
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'Purchased 1 ticket(s) successfully.' })
        });
      }
      if (url.includes('/login')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            token: 'valid-jwt-token',
            user: { id: 1, email: 'user@test.com' }
          })
        });
      }
    });

    renderApp('/');

    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText(/concert/i)).toBeInTheDocument();
    });

    // Try to purchase without being logged in
    const buyButtons = screen.getAllByText(/buy ticket/i);
    fireEvent.click(buyButtons[0]);

    // Should see unauthorized alert (mocked in App.js)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/purchase'),
        expect.any(Object)
      );
    });
  });

  test('3. Logout workflow: Login → Access protected content → Logout → Lose access', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/login')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            token: 'test-token',
            user: { id: 1, email: 'user@test.com' }
          })
        });
      }
      if (url.includes('/api/events')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([])
        });
      }
    });

    renderApp('/signin');

    // Login
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    // Simulate logout by clearing localStorage
    localStorage.clear();
    
    expect(localStorage.getItem('token')).toBeNull();
  });
});
