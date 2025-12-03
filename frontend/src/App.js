import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/homePage';
import EventsPage from './pages/eventsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_CLIENT_API_URL}/api/events`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      });
  }, []);

  const buyTicket = async (eventId, amount = 1) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_CLIENT_API_URL}/api/events/${eventId}/purchase`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (response.status === 401) {
          logout();
          alert('Session expired. Please sign in again.');
          navigate('/signin');
          return;
      }

      const data = await response.json();
      alert(data.message || `Ticket purchased for: ${eventId}`);
      // Re-fetch events to update ticket count in UI
      setLoading(true);
      fetch(`${process.env.REACT_APP_CLIENT_API_URL}/api/events`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          setEvents(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load events. Please try again later.');
          setLoading(false);
        });
    } catch (error) {
      alert('Failed to purchase ticket.');
      console.error(error);
    }
  };

  return (
    <Layout onBuyTicket={buyTicket}>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Public Routes */}
        <Route 
          path="/" 
          element={<HomePage events={events} onBuyTicket={buyTicket} />} 
        />
        <Route 
          path="/events" 
          element={<EventsPage events={events} loading={loading} error={error} onBuyTicket={buyTicket} />} 
        />
      </Routes>
    </Layout>
  );
}

export default App;

