'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import { getEventById } from '@/services/eventService';
import { buyTicket } from '@/services/ticketService';
import { EventData } from '@/components/events/EventCarousel';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingTicket, setBuyingTicket] = useState(false);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventData = await getEventById(id as string);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBuyTicket = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet to purchase a ticket');
      return;
    }

    try {
      setBuyingTicket(true);
      
      // Call the buyTicket service
      const result = await buyTicket(id as string, publicKey.toString());
      
      if (result.success) {
        toast.success('Ticket purchased successfully!');
        
        // Optionally redirect to tickets page
        setTimeout(() => {
          router.push('/tickets');
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to purchase ticket');
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast.error('Failed to purchase ticket');
    } finally {
      setBuyingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Browse all events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href="/events" className="text-indigo-600 hover:text-indigo-800">
              ← Back to events
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 md:h-96 relative">
              <img 
                src={event.imageUrl || 'https://via.placeholder.com/800x400?text=Event'}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
                <Link 
                  href={`/organizations/${event.organizationId}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  by {event.organizationName}
                </Link>
              </div>
              
              <div className="flex flex-col space-y-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{event.venue}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Get Tickets</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">General Admission</span>
                <span className="font-medium">0.1 SOL</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Available</span>
                <span className="font-medium">98/100</span>
              </div>
              
              <button
                onClick={handleBuyTicket}
                disabled={buyingTicket || !connected}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyingTicket ? 'Processing...' : 'Buy Ticket'}
              </button>
              
              {!connected && (
                <p className="text-sm text-red-500 mt-2">
                  Please connect your wallet to purchase tickets
                </p>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-2">Event Details</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>Doors open 1 hour before start</span>
              </div>
              <p className="text-sm text-gray-500">
                Tickets are non-refundable. This event follows all local health and safety guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}