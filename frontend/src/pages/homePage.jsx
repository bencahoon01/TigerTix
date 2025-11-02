'use client'

import { Link } from 'react-router-dom';
import Layout from '../components/Layout'
import campus1 from '../assets/campus1.jpg'
import football from '../assets/football.jpg'
import brooksconcert from '../assets/brooksconcert.jpg'
import graduation from '../assets/graduation.jpg'

const collections = [
    {
        name: "Sporting Events",
        href: '/events',
        imageSrc: football,
        imageAlt: 'A football game at Memorial Stadium',
    },
    {
        name: "Concerts",
        href: '/events',
        imageSrc: brooksconcert,
        imageAlt: 'A concert at the Brooks Center for the Performing Arts',
    },
    {
        name: 'Academic Events',
        href: '/events',
        imageSrc: graduation,
        imageAlt: 'A graduation ceremony at Littlejohn Coliseum',
    },
]
const trendingProducts = [
    {
        id: 1,
        name: 'Clemson vs. South Carolina Football',
        color: 'Memorial Stadium',
        price: '$150',
        href: '#',
    },
    {
        id: 2,
        name: 'Fall Concert Series: The Tams',
        color: 'Brooks Center',
        price: '$25',
        href: '#',
    },
    {
        id: 3,
        name: 'Guest Speaker: AI in modern world',
        color: 'Watt Family Innovation Center',
        price: 'Free',
        href: '#',
    },
    {
        id: 4,
        name: 'Clemson Basketball vs. Duke',
        color: 'Littlejohn Coliseum',
        price: '$50',
        href: '#',
    },
]
const perks = [
    {
        name: 'Easy Cancellations',
        imageUrl: 'https://tailwindcss.com/plus-assets/img/ecommerce/icons/icon-returns-light.svg',
        description: 'Cancel up to 24 hours before the event for a full refund.',
    },
    {
        name: 'Instant Ticket Delivery',
        imageUrl: 'https://tailwindcss.com/plus-assets/img/ecommerce/icons/icon-calendar-light.svg',
        description: 'Your tickets will be delivered via email with a scannable QR code upon purchase.',
    },
    {
        name: 'Student Discounts',
        imageUrl: 'https://tailwindcss.com/plus-assets/img/ecommerce/icons/icon-gift-card-light.svg',
        description: 'Login with your Clemson student account to get special discounts.',
    },
    {
        name: 'Support Clemson',
        imageUrl: 'https://tailwindcss.com/plus-assets/img/ecommerce/icons/icon-planet-light.svg',
        description: 'A portion of every purchase goes towards supporting Clemson University programs.',
    },
]

export default function HomePage({ onBuyTicket }) {
    return (
        <Layout onBuyTicket={onBuyTicket}>
            <main>
                {/* Hero section */}
                <div className="relative">
                    {/* Background image and overlap */}
                    <div aria-hidden="true" className="absolute inset-0 hidden sm:flex sm:flex-col">
                        <div className="relative w-full flex-1 bg-violet-700">
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    alt=""
                                    src={campus1}
                                    className="size-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-slate-700 opacity-50" />
                            <div className={"absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"} />
                        </div>
                        <div className="h-32 w-full bg-white md:h-40 lg:h-48" />
                    </div>

                    <div className="relative mx-auto max-w-3xl px-4 pb-96 text-center sm:px-6 sm:pb-0 lg:px-8">
                        {/* Background image and overlap */}
                        <div aria-hidden="true" className="absolute inset-0 flex flex-col sm:hidden">
                            <div className="relative w-full flex-1 bg-violet-700">
                                <div className="absolute inset-0 overflow-hidden">
                                    <img
                                        alt=""
                                        src={campus1}
                                        className="size-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-violet-800 opacity-50" />
                            </div>
                            <div className="h-48 w-full bg-white" />
                        </div>
                        <div className="relative py-32">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Tiger Tix</h1>
                            <h2 className="mt-4 text-lg font-medium text-gray-100">Search for and purchase tickets for events in the Clemson area</h2>
                            <div className="mt-4 sm:mt-6">
                                <Link
                                    to="/events"
                                    className="inline-block rounded-md border border-transparent bg-orange-500 px-8 py-3 font-medium text-white hover:bg-orange-600"
                                >
                                    Browse Upcoming Events
                                </Link>
                            </div>
                        </div>
                    </div>

                    <section aria-labelledby="collection-heading" className="relative -mt-96 sm:mt-0">
                        <h2 id="collection-heading" className="sr-only">
                            Collections
                        </h2>
                        <div className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 lg:gap-x-8 lg:px-8">
                            {collections.map((collection) => (
                                <div
                                    key={collection.name}
                                    className="group relative h-96 rounded-lg bg-white shadow-xl sm:aspect-[4/5] sm:h-auto"
                                >
                                    <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-lg">
                                        <div className="absolute inset-0 overflow-hidden group-hover:opacity-75">
                                            <img alt={collection.imageAlt} src={collection.imageSrc} className="size-full object-cover" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
                                    </div>
                                    <div className="absolute inset-0 flex items-end rounded-lg p-6">
                                        <div>
                                            <p aria-hidden="true" className="text-sm text-white">
                                                View Events
                                            </p>
                                            <h3 className="mt-1 font-semibold text-white">
                                                <Link to={collection.href}>
                                                    <span className="absolute inset-0" />
                                                    {collection.name}
                                                </Link>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section aria-labelledby="trending-heading">
                    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
                        <div className="md:flex md:items-center md:justify-between">
                            <h2 id="favorites-heading" className="text-2xl font-bold tracking-tight text-gray-900">
                                Trending Events
                            </h2>
                            <Link to="/events" className="hidden text-sm font-medium text-orange-500 hover:text-orange-500 md:block">
                                View Events
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
                            {trendingProducts.map((product) => (
                                <div key={product.id} className="group relative rounded-lg bg-white shadow">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <p className="text-sm font-medium text-gray-900">{product.price}</p>
                                    </div>
                                    <a href={product.href} className="absolute inset-0" aria-label={`View ${product.name}`}>
                                        <span className="sr-only">View {product.name}</span>
                                    </a>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-sm md:hidden">
                            <Link to="/events" className="font-medium text-orange-500 hover:text-orange-500">
                                View Events
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="perks-heading" className="border-t border-gray-200 bg-gray-50">
                    <h2 id="perks-heading" className="sr-only">
                        Our perks
                    </h2>

                    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
                            {perks.map((perk) => (
                                <div
                                    key={perk.name}
                                    className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                                >
                                    <div className="md:shrink-0">
                                        <div className="flow-root">
                                            <img alt="" src={perk.imageUrl} className="-my-1 mx-auto h-24 w-auto" />
                                        </div>
                                    </div>
                                    <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                                        <h3 className="text-base font-medium text-gray-900">{perk.name}</h3>
                                        <p className="mt-3 text-sm text-gray-500">{perk.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    )
}
