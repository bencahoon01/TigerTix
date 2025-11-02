import { useRef } from 'react';
import Layout from '../components/Layout';
import ProductFilter from "../components/productFilter";
import PurchaseButton from '../components/purchaseButton';

export default function EventsPage({ events, loading, error, onBuyTicket }) {
    const purchaseSoundRef = useRef(new Audio('/purchase-sound.mp3'));

    const handlePurchase = async (eventId) => {
        try {
            purchaseSoundRef.current.play();
        } catch (e) {
            console.error("Error playing sound:", e);
        }

        onBuyTicket(eventId);
    };

    return (
        <Layout onBuyTicket={onBuyTicket}>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">All Events</h1>
                    <ProductFilter />
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
