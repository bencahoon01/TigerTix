import React, { useEffect, useState } from 'react';
import HomePage from './pages/homePage';

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
    <HomePage events={events} onBuyTicket={buyTicket} />
  );
}

export default App;