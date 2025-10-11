import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductFilter from "../components/productFilter";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_CLIENT_API_URL}/events`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setEvents(data);
            } catch (e) {
                console.error("Failed to fetch events:", e);
                setError("Failed to load events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <Layout>
            <h1>Upcoming Events</h1>
            <ProductFilter />

            {loading && <p>Loading events...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <ul>
                    {events.map(event => (
                        <li key={event.id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
                    ))}
                </ul>
            )}
        </Layout>
    );
}
