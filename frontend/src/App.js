import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import EventsPage from './pages/eventsPage';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch(`${process.env.REACT_APP_CLIENT_API_URL}/events`)
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

    const buyTicket = async (eventId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_CLIENT_API_URL}/events/${eventId}/purchase`, {
          method: 'POST',
        });
        const data = await response.json();
        alert(data.message || `Ticket purchased for: ${eventId}`);
        // Re-fetch events to update ticket count in UI
        setLoading(true);
        fetch(`${process.env.REACT_APP_CLIENT_API_URL}/events`)
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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage events={events} onBuyTicket={buyTicket} />} />
        <Route path="/events" element={<EventsPage events={events} loading={loading} error={error} onBuyTicket={buyTicket} />} />
      </Routes>
    </Router>
  );
}

export default App;
