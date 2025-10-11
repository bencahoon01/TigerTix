import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import EventsPage from './pages/eventsPage';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  const buyTicket = (eventName) => {
    alert(`Ticket purchased for: ${eventName}`);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage events={events} onBuyTicket={buyTicket} />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
