'use client'

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductFilter from "../components/productFilter";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // This assumes your backend API for events is at /api/events
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
      <Layout>
          <ProductFilter />
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Upcoming Events</h2>

            {loading && <p>Loading events...</p>}
            {error && <p>Error fetching events: {error}</p>}

            {!loading && !error && (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {events.map((event) => (
                  <div key={event.id} className="group relative overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        {/* Assuming events will have their own pages, e.g., /events/123 */}
                        <a href={'#'}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {event.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <p className="text-sm font-medium text-gray-900">{event.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
  );
}
