'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TicketData } from '@/services/ticketService';
import { EventData } from '@/components/events/EventCarousel';
import { CalendarIcon, MapPinIcon, ClockIcon, QrCodeIcon } from '@heroicons/react/24/outline';

interface TicketCardProps {
  ticket: TicketData;
  event: EventData;
}

export default function TicketCard({ ticket, event }: TicketCardProps) {
  const [showQR, setShowQR] = useState(false);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatPurchaseDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={event.imageUrl || 'https://via.placeholder.com/400x200?text=Event'} 
          alt={event.name}
          className="w-full h-40 object-cover"
        />
        
        <div className="absolute top-0 right-0 m-4 bg-indigo-600 text-white py-1 px-3 rounded-full text-xs font-medium">
          {ticket.ticketType}
        </div>
        
        {ticket.used && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-red-600 text-white py-2 px-4 rounded-md transform -rotate-12 text-lg font-bold">
              USED
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{event.name}</h3>
        
        <div className="mb-3">
          <div className="flex items-center text-gray-600 text-sm mb-1">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{event.venue}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-gray-500">
            Purchased: {formatPurchaseDate(ticket.purchaseDate)}
          </div>
          <div className="text-sm font-medium text-gray-700">
            {ticket.price} SOL
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/events/${event.id}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Event Details
          </Link>
          
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            <QrCodeIcon className="h-5 w-5 mr-1" />
            {showQR ? 'Hide Ticket' : 'Show Ticket'}
          </button>
        </div>
        
        {showQR && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col items-center">
              {/* Placeholder for QR code - in a real app, generate an actual QR */}
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-2">
                <svg className="w-36 h-36 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h6v6H3zm2 2v2h2V5zm1 1V5h1v1zm-3 5h6v6H3zm2 2v2h2v-2zm1 1v-1h1v1zm11-11h-6v6h6zm-2 2v2h-2V5zm-1 1V5h-1v1zm-1 7h-2v-2h-2v6h6v-6h-2zm-2 2v2h2v-2zm7-2h-2v2h2zm0 2v2h2v-2h-2zm-1-2h-2v2h2v2h2v-4h-2z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 text-center">Ticket ID: {ticket.id}</p>
              <p className="text-xs text-gray-400 text-center mt-1">Present this code at the event entrance</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}