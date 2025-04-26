'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

// Event type definition
export interface EventData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  venue: string;
  organizationId: string;
  organizationName: string;
}

interface EventCarouselProps {
  events: EventData[];
  title: string;
}

export default function EventCarousel({ events, title }: EventCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Calculate the maximum scroll width
  useEffect(() => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      setMaxScroll(scrollWidth - clientWidth);
    }
  }, [events]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount = current.clientWidth * 0.8;
      
      if (direction === 'left') {
        const newPosition = Math.max(0, scrollPosition - scrollAmount);
        current.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
      } else {
        const newPosition = Math.min(
          maxScroll,
          scrollPosition + scrollAmount
        );
        current.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
      }
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ArrowLeftCircleIcon className="h-8 w-8 text-indigo-600" />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={scrollPosition >= maxScroll}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ArrowRightCircleIcon className="h-8 w-8 text-indigo-600" />
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {events.map((event) => (
          <Link 
            href={`/events/${event.id}`} 
            key={event.id}
            className="flex-none w-72 transform transition duration-300 hover:scale-105"
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
                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{event.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{event.venue}</p>
                <p className="text-xs text-gray-500 italic">by {event.organizationName}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}