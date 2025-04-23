'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EventData } from '@/components/events/EventCarousel';
import EventGrid from '@/components/events/EventGrid';
import { mockEvents } from '@/utils/mockData';

export default function PastEventsPage() {
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Filter events that have already ended
    const mockCurrentDate = new Date('2025-05-11T12:00:00Z');
    
    const past = mockEvents.filter(event => {
      const endDate = new Date(event.endDate);
      return endDate < mockCurrentDate;
    });
    
    setPastEvents(past);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/events" className="text-indigo-600 hover:text-indigo-800 mr-4">
          ← Back to Events
        </Link>
        <h1 className="text-3xl font-bold">Past Events</h1>
      </div>
      
      <EventGrid events={pastEvents} title="Past Events" />
    </div>
  );
}