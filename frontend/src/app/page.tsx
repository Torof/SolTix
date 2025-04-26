'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventCarousel, { EventData } from '@/components/events/EventCarousel';
import EventGrid from '@/components/events/EventGrid';
import { getUpcomingEvents, getOngoingEvents } from '@/services/eventService';
import { useWallet } from '@solana/wallet-adapter-react';

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const wallet = useWallet();
  
  // Fetch events using the service
  useEffect(() => {
    async function fetchEvents() {
      try {
        const [upcoming, ongoing] = await Promise.all([
          getUpcomingEvents(wallet),
          getOngoingEvents(wallet)
        ]);
        
        setUpcomingEvents(upcoming);
        setOngoingEvents(ongoing);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, [wallet, wallet.connected]); // Re-fetch when wallet connects or changes

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link 
          href="/events/past" 
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View Past Events
        </Link>
      </div>
      
      {!wallet.connected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <p className="text-sm text-yellow-700">
              Connect your wallet to see blockchain events. Showing mock data for now.
            </p>
          </div>
        </div>
      )}
      
      <EventCarousel events={upcomingEvents} title="Upcoming Events" />
      
      <div className="my-8 border-t border-gray-200"></div>
      
      <EventGrid events={ongoingEvents} title="Ongoing Events" />
    </div>
  );
}