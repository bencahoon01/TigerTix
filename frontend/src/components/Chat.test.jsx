import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from './Chat';

global.fetch = jest.fn();

describe('Chat Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_LLM_API_URL = 'http://localhost:5003/api';
  });

  test('1. Renders chat toggle button', () => {
    render(<Chat onBookingConfirmed={jest.fn()} />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('2. Opens chat window when toggle button clicked', () => {
    render(<Chat onBookingConfirmed={jest.fn()} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText(/jynxi/i)).toBeInTheDocument();
  });

  test('3. Sends message to LLM service', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Hello! How can I help you today?'
      })
    });

    render(<Chat onBookingConfirmed={jest.fn()} />);
    
    // Open chat
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    // Type and send message
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5003/api/chat',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ message: 'Hello' })
        })
      );
    });
  });

  test('4. Displays LLM response in chat', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'I can help you book tickets!'
      })
    });

    render(<Chat onBookingConfirmed={jest.fn()} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'Help' } });
    
    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/i can help you book tickets/i)).toBeInTheDocument();
    });
  });

  test('5. Handles booking proposal from LLM', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        action: 'propose_booking',
        eventName: 'Test Event',
        eventId: 'e1',
        amount: 2
      })
    });

    const mockOnBooking = jest.fn();
    render(<Chat onBookingConfirmed={mockOnBooking} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'Book 2 tickets for Test Event' } });
    
    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/would you like to buy/i)).toBeInTheDocument();
    });
  });
});
