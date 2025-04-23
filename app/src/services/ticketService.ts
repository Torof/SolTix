import { EventData } from '@/components/events/EventCarousel';
import { mockEvents } from '@/utils/mockData';

export interface TicketData {
  id: string;
  eventId: string;
  owner: string;
  purchaseDate: string;
  ticketType: string;
  price: number;
  used: boolean;
}

// Mock ticket data for demonstration
const mockTickets: TicketData[] = [
  {
    id: 'ticket1',
    eventId: '2',
    owner: 'demo-wallet-address',
    purchaseDate: '2025-05-01T14:30:00Z',
    ticketType: 'General Admission',
    price: 0.1,
    used: false
  },
  {
    id: 'ticket2',
    eventId: '3',
    owner: 'demo-wallet-address',
    purchaseDate: '2025-04-25T09:15:00Z',
    ticketType: 'VIP Access',
    price: 0.25,
    used: false
  },
  {
    id: 'ticket3',
    eventId: '4',
    owner: 'demo-wallet-address',
    purchaseDate: '2025-05-02T16:45:00Z',
    ticketType: 'General Admission',
    price: 0.15,
    used: false
  }
];

export async function getUserTickets(walletAddress: string): Promise<{ticket: TicketData, event: EventData}[]> {
  // In the future, this would fetch tickets owned by the user from your Solana program
  // For now, we'll return the mock tickets with their corresponding event data
  
  const userTickets = mockTickets.filter(ticket => ticket.owner === walletAddress);
  
  // Enrich with event data
  return userTickets.map(ticket => {
    const event = mockEvents.find(event => event.id === ticket.eventId) || {
      id: ticket.eventId,
      name: 'Unknown Event',
      description: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
      venue: '',
      organizationId: '',
      organizationName: ''
    };
    
    return { ticket, event };
  });
}

export async function buyTicket(eventId: string, walletAddress: string): Promise<{success: boolean, ticketId?: string, error?: string}> {
  // In the future, this would call your Solana program to purchase a ticket
  // For now, we'll just simulate a successful purchase
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a success response
  return {
    success: true,
    ticketId: `ticket-${Date.now()}`,
  };
}