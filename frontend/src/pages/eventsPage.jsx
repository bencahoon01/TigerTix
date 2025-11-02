
import React, { useRef, useState } from 'react';
import Layout from '../components/Layout';
import ProductFilter from "../components/productFilter";
import PurchaseButton from '../components/purchaseButton';

function EventRow({ event, onBuyTicket, playSound }) {
    const [amount, setAmount] = useState(1);
    const handlePurchase = () => {
        playSound();
        onBuyTicket(event.id, amount);
    };
    return (
        <li key={event.id} className="flex py-8">
            <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{event.name}</h3>
                    <p className="ml-4">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                <p className="mt-2 text-sm font-semibold text-indigo-600">
                    {event.ticketsAvailable} tickets available
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="number"
                            min={1}
                            max={event.ticketsAvailable}
                            value={amount}
                            onChange={e => setAmount(Math.max(1, Math.min(event.ticketsAvailable, Number(e.target.value))))}
                            className="w-16 px-2 py-1 border rounded"
                        />
                        <PurchaseButton onClick={handlePurchase} />
                    </div>
                </p>
            </div>
        </li>
    );
}

export default function EventsPage({ events, loading, error, onBuyTicket }) {
    const purchaseSoundRef = useRef(new Audio('/purchase-sound.mp3'));
    const playSound = () => {
        try {
            purchaseSoundRef.current.play();
        } catch (e) {
            console.error("Error playing sound:", e);
        }
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
                                        <EventRow key={event.id} event={event} onBuyTicket={onBuyTicket} playSound={playSound} />
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
