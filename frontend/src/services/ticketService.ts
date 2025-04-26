import { EventData } from '@/components/events/EventCarousel';
import { mockEvents } from '@/utils/mockData';
import { Connection, PublicKey } from '@solana/web3.js';
import { 
  getProvider, 
  getOrganizationProgram, 
  getEventProgram,
  getTicketPDA,
  getEventManagerPDA,
  ORGANIZATION_PROGRAM_ID,
  NETWORK 
} from '@/utils/programUtils';

// Define TicketData interface
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

export async function getUserTickets(walletAddress: string, wallet?: any): Promise<{ticket: TicketData, event: EventData}[]> {
  // If no wallet is connected, return mock data
  if (!wallet || !wallet.publicKey) {
    console.log('No wallet connected, using mock data');
    
    // Enrich with event data
    return mockTickets.map(ticket => {
      const event = mockEvents.find(event => event.id === ticket.eventId) || {
        id: ticket.eventId,
        name: 'Unknown Event',
        description: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        venue: '',
        organizationId: '',
        organizationName: '',
        status: 'Upcoming'
      };
      
      return { ticket, event };
    });
  }

  try {
    // For now, just return mock data
    // In a real implementation, you would fetch tickets from the blockchain
    return mockTickets.map(ticket => {
      const event = mockEvents.find(event => event.id === ticket.eventId) || {
        id: ticket.eventId,
        name: 'Unknown Event',
        description: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        venue: '',
        organizationId: '',
        organizationName: '',
        status: 'Upcoming'
      };
      
      return { ticket, event };
    });
  } catch (error) {
    console.error('Error fetching user tickets from blockchain:', error);
    
    // Fallback to mock data
    return mockTickets.map(ticket => {
      const event = mockEvents.find(event => event.id === ticket.eventId) || {
        id: ticket.eventId,
        name: 'Unknown Event',
        description: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        venue: '',
        organizationId: '',
        organizationName: '',
        status: 'Upcoming'
      };
      
      return { ticket, event };
    });
  }
}

export async function buyTicket(
  eventId: string, 
  walletAddress: string,
  wallet?: any
): Promise<{success: boolean, ticketId?: string, error?: string}> {
  if (!wallet || !wallet.publicKey) {
    return { success: false, error: 'Wallet not connected' };
  }
  
  try {
    const connection = new Connection(NETWORK);
    const provider = getProvider(wallet, connection);
    
    // Get the event program
    const eventProgram = getEventProgram(provider);
    if (!eventProgram) {
      return { success: false, error: 'Failed to get event program' };
    }
    
    // For now, simulate a successful ticket purchase
    // In a real implementation, you would call the blockchain

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      ticketId: `ticket-${Date.now()}`,
    };
  } catch (error: any) {
    console.error('Error buying ticket on blockchain:', error);
    return { 
      success: false, 
      error: `Failed to buy ticket: ${error.message || 'Unknown error'}` 
    };
  }
}