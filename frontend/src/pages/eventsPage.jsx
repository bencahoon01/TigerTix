import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductFilter from "../components/productFilter";
import PurchaseButton from '../components/purchaseButton'

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        /**
        * Fetches all events from the server when the component mounts.
        * Updates state with events data or sets an error message.
        */
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

    /**
     * Handles purchasing a ticket for a given event.
     * Sends a POST request to the server and updates the UI.
     * @param {number} eventId - The ID of the event to purchase a ticket for.
     */
    const handlePurchase = async (eventId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_CLIENT_API_URL}/events/${eventId}/purchase`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Purchase failed.' }));
                throw new Error(errorData.message || 'Purchase failed.');
            }

            console.log("Purchase successful, database updated.");
            window.alert('Purchase successful!');

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId
                        ? { ...event, ticketsAvailable: event.ticketsAvailable - 1 }
                        : event
                )
            );
        } catch (err) {
            console.error("Purchase error:", err);
            window.alert(`Error: ${err.message}`);
        }
    };

    return (
        <Layout>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">All Events</h1>
                    <ProductFilter />
                    {/* 
                      This section uses aria-live to announce content changes to screen readers.
                      When loading, it announces "Loading...". When content appears, it's announced.
                    */}
                    <div aria-live="polite" aria-atomic="true">
                        {loading && <p>Loading...</p>}
                        {error && <p role="alert">{error}</p>}
                        {!loading && !error && (
                            <div className="mt-8 flow-root">
                            <ul role="list" className="-my-8 divide-y divide-gray-200">
                                {events.map((event) => (
                                    <li key={event.id} className="flex py-8">
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{event.name}</h3>
                                                <p className="ml-4">{new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                                            <p className="mt-2 text-sm font-semibold text-indigo-600">
                                                {event.ticketsAvailable} tickets available
                                                <PurchaseButton onClick={() => handlePurchase(event.id)} />
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}