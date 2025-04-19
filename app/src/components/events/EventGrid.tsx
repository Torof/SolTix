'use client';

import React from 'react';
import Link from 'next/link';
import { EventData } from './EventCarousel';

interface EventGridProps {
  events: EventData[];
  title: string;
}

export default function EventGrid({ events, title }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">No events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link 
            href={`/events/${event.id}`} 
            key={event.id}
            className="transform transition duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={event.imageUrl || 'https://via.placeholder.com/300x150?text=Event'} 
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm font-medium">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{event.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{event.venue}</p>
                <p className="text-xs text-gray-700 line-clamp-2 mb-2">{event.description}</p>
                <p className="text-xs text-gray-500 italic">by {event.organizationName}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}