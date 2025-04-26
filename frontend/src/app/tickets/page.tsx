'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserTickets, TicketData } from '@/services/ticketService';
import { EventData } from '@/components/events/EventCarousel';
import TicketCard from '@/components/tickets/TicketCard';
import dynamic from 'next/dynamic';

// Dynamically import our custom wallet button
const WalletConnectDynamic = dynamic(
  () => import('@/components/ui/WalletConnect'),
  { ssr: false }
);

export default function MyTicketsPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [tickets, setTickets] = useState<{ticket: TicketData, event: EventData}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      if (connected && publicKey) {
        try {
          // In a real app, use the actual wallet address
          // For demo, we'll use a fake address since we're using mock data
          const userTickets = await getUserTickets('demo-wallet-address');
          setTickets(userTickets);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      }
      setLoading(false);
    }

    fetchTickets();
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tickets</h1>
          <p className="text-gray-600 mb-6">Connect your wallet to view your tickets.</p>
          
          <div className="flex justify-center">
            <WalletConnectDynamic />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Tickets</h1>
      
      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No tickets yet</h2>
          <p className="text-gray-600 mb-6">You haven't purchased any tickets yet.</p>
          <button
            onClick={() => router.push('/events')}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Explore Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(({ ticket, event }) => (
            <TicketCard key={ticket.id} ticket={ticket} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}