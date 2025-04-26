import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { 
  getProvider, 
  getOrganizationProgram, 
  getRegistryProgram,
  getEventsRegistryPDA,
  getOrganizationPDA,
  getEventPDA,
  getRegistryPDA,
  NETWORK 
} from '@/utils/programUtils';
import { fetchFromIPFS } from '@/utils/ipfs';
import { mockEvents } from '@/utils/mockData';
import { EventData } from '@/components/events/EventCarousel';

// Use mockData for fallback or when wallet not connected
export async function getAllEvents(wallet?: any): Promise<EventData[]> {
  // If no wallet is connected, return mock data
  if (!wallet || !wallet.publicKey) {
    console.log('No wallet connected, using mock data');
    return mockEvents;
  }

  // For now, just return mock data
  // In a real implementation, you would fetch events from the blockchain
  return mockEvents;
}

export async function getEventById(id: string, wallet?: any): Promise<EventData | null> {
  // If no wallet is connected, return mock data
  if (!wallet || !wallet.publicKey) {
    return mockEvents.find(event => event.id === id) || null;
  }
  
  // For now, just return mock data
  // In a real implementation, you would fetch the event by ID
  return mockEvents.find(event => event.id === id) || null;
}

export async function getUpcomingEvents(wallet?: any): Promise<EventData[]> {
  // This could use a query filter in the future
  // For now, we'll fetch all events and filter them
  const allEvents = await getAllEvents(wallet);
  const now = new Date();
  return allEvents.filter(event => new Date(event.startDate) > now);
}

export async function getOngoingEvents(wallet?: any): Promise<EventData[]> {
  // This could use a query filter in the future
  // For now, we'll fetch all events and filter them
  const allEvents = await getAllEvents(wallet);
  const now = new Date();
  return allEvents.filter(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return startDate <= now && endDate >= now;
  });
}

// Create a new event
export async function createEvent(
  name: string,
  description: string,
  location: string,
  date: Date,
  price: number,
  maxCapacity: number,
  ticketMetadataUri: string,
  wallet: any
): Promise<{ success: boolean, eventId?: string, error?: string }> {
  if (!wallet || !wallet.publicKey) {
    return { success: false, error: 'Wallet not connected' };
  }
  
  try {
    const connection = new Connection(NETWORK);
    const provider = getProvider(wallet, connection);
    
    // Get the organization program
    const organizationProgram = getOrganizationProgram(provider);
    if (!organizationProgram) {
      return { success: false, error: 'Failed to get organization program' };
    }
    
    try {
      // Get the organization PDA
      const organizationPDA = getOrganizationPDA(wallet.publicKey);
      
      // For now, we'll use a mock eventPDA
      // In a real implementation, you would calculate this based on the organization's event count
      const [eventPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('event'), organizationPDA.toBuffer(), Buffer.from('0')],
        organizationProgram.programId
      );
      
      // Get the registry program
      const registryProgram = getRegistryProgram(provider);
      if (!registryProgram) {
        return { success: false, error: 'Failed to get registry program' };
      }
      
      // Get the registry and events registry PDAs
      const registryPDA = getRegistryPDA();
      const eventsRegistryPDA = getEventsRegistryPDA();
      
      // Convert date to Unix timestamp
      const unixTimestamp = Math.floor(date.getTime() / 1000);
      
      // Convert price to lamports
      const priceInLamports = new BN(price * 1_000_000_000); // Convert SOL to lamports
      
      // Create the event
      await organizationProgram.methods
        .createEvent(
          name,
          description,
          location,
          new BN(unixTimestamp),
          priceInLamports,
          maxCapacity,
          ticketMetadataUri
        )
        .accounts({
          owner: wallet.publicKey,
          organization: organizationPDA,
          event: eventPDA,
          systemProgram: PublicKey.default,
          registryProgram: registryProgram.programId,
          registry: registryPDA,
          eventsRegistry: eventsRegistryPDA
        })
        .rpc();
      
      return { 
        success: true, 
        eventId: eventPDA.toString()
      };
    } catch (err: any) {
      console.error('Error in event creation process:', err);
      return { 
        success: false, 
        error: `Event creation error: ${err.message || 'Unknown error'}`
      };
    }
  } catch (error: any) {
    console.error('Error creating event on blockchain:', error);
    return { 
      success: false, 
      error: `Failed to create event: ${error.message || 'Unknown error'}` 
    };
  }
}

// Update event status
export async function updateEventStatus(
  eventId: string,
  newStatus: number, // 0: Upcoming, 1: Ongoing, 2: Finished
  wallet: any
): Promise<{ success: boolean, error?: string }> {
  if (!wallet || !wallet.publicKey) {
    return { success: false, error: 'Wallet not connected' };
  }
  
  try {
    const connection = new Connection(NETWORK);
    const provider = getProvider(wallet, connection);
    
    // Get the organization program
    const organizationProgram = getOrganizationProgram(provider);
    if (!organizationProgram) {
      return { success: false, error: 'Failed to get organization program' };
    }
    
    try {
      // Get the organization PDA
      const organizationPDA = getOrganizationPDA(wallet.publicKey);
      
      // Get registry program and PDAs
      const registryProgram = getRegistryProgram(provider);
      if (!registryProgram) {
        return { success: false, error: 'Failed to get registry program' };
      }
      
      const registryPDA = getRegistryPDA();
      const eventsRegistryPDA = getEventsRegistryPDA();
      
      // Update the event status
      await organizationProgram.methods
        .updateEventStatus(newStatus)
        .accounts({
          owner: wallet.publicKey,
          event: new PublicKey(eventId),
          organization: organizationPDA,
          registryProgram: registryProgram.programId,
          registry: registryPDA,
          eventsRegistry: eventsRegistryPDA
        })
        .rpc();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error in event status update process:', err);
      return { 
        success: false, 
        error: `Status update error: ${err.message || 'Unknown error'}`
      };
    }
  } catch (error: any) {
    console.error('Error updating event status:', error);
    return { 
      success: false, 
      error: `Failed to update event status: ${error.message || 'Unknown error'}` 
    };
  }
}

// For demo purposes, still provide the mock functions
export async function getUpcomingEventsMock(): Promise<EventData[]> {
  const mockDate = new Date('2025-05-11T12:00:00Z');
  return mockEvents.filter(event => new Date(event.startDate) > mockDate);
}

export async function getOngoingEventsMock(): Promise<EventData[]> {
  const mockDate = new Date('2025-05-11T12:00:00Z');
  return mockEvents.filter(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return startDate <= mockDate && endDate >= mockDate;
  });
}