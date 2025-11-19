import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import HomePage from '../pages/homePage';
import EventsPage from '../pages/eventsPage';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';

expect.extend(toHaveNoViolations);

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Accessibility Tests', () => {
  
  describe('ARIA Labels and Roles', () => {
    test('1. SignInPage has proper aria-labels', () => {
      renderWithRouter(<SignInPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('2. SignUpPage has proper aria-labels', () => {
      renderWithRouter(<SignUpPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    test('3. EventsPage has role="alert" for errors', () => {
      const mockEvents = [];
      renderWithRouter(
        <Layout>
          <EventsPage 
            events={mockEvents} 
            loading={false} 
            error="Failed to load events" 
            onBuyTicket={jest.fn()} 
          />
        </Layout>
      );
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/failed to load events/i);
    });

    test('4. HomePage has aria-labelledby for sections', () => {
      renderWithRouter(
        <Layout>
          <HomePage events={[]} onBuyTicket={jest.fn()} />
        </Layout>
      );
      
      const sections = screen.getAllByRole('region');
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe('Keyboard Navigation', () => {
    test('5. All form inputs are keyboard accessible', () => {
      renderWithRouter(<SignInPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Check that elements can receive focus
      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);
      
      passwordInput.focus();
      expect(document.activeElement).toBe(passwordInput);
      
      submitButton.focus();
      expect(document.activeElement).toBe(submitButton);
    });

    test('6. Links are keyboard accessible', () => {
      renderWithRouter(<SignInPage />);
      
      const createAccountLink = screen.getByRole('link', { name: /create an account/i });
      expect(createAccountLink).toBeInTheDocument();
      
      createAccountLink.focus();
      expect(document.activeElement).toBe(createAccountLink);
    });
  });

  describe('Form Validation', () => {
    test('7. Email input has correct type and autocomplete', () => {
      renderWithRouter(<SignInPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
    });

    test('8. Password input has correct type and autocomplete', () => {
      renderWithRouter(<SignInPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autoComplete');
    });

    test('9. Required fields are marked as required', () => {
      renderWithRouter(<SignInPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Semantic HTML', () => {
    test('10. Buttons use button element with proper type', () => {
      renderWithRouter(<SignInPage />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton.tagName).toBe('BUTTON');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('11. Form uses form element', () => {
      const { container } = renderWithRouter(<SignInPage />);
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    test('12. Error messages have appropriate styling', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      });

      const { container } = renderWithRouter(<SignInPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      emailInput.value = 'test@test.com';
      passwordInput.value = 'wrong';
      submitButton.click();
      
      await screen.findByText(/invalid credentials/i);
      
      const errorMessage = screen.getByText(/invalid credentials/i);
      expect(errorMessage).toHaveClass('text-red-600');
    });
  });
});
