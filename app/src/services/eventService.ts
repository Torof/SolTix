import { EventData } from '@/components/events/EventCarousel';
import { mockEvents } from '@/utils/mockData';

// These functions mimic how we'd interact with the blockchain
export async function getAllEvents(): Promise<EventData[]> {
  // In the future, this would fetch events from your Solana program
  return mockEvents;
}

export async function getEventById(id: string): Promise<EventData | null> {
  // In the future, this would fetch a specific event account from your Solana program
  return mockEvents.find(event => event.id === id) || null;
}

export async function getUpcomingEvents(): Promise<EventData[]> {
  // In the future, this would query your program for upcoming events
  const now = new Date();
  return mockEvents.filter(event => new Date(event.startDate) > now);
}

export async function getOngoingEvents(): Promise<EventData[]> {
  // In the future, this would query your program for ongoing events
  const now = new Date();
  return mockEvents.filter(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return startDate <= now && endDate >= now;
  });
}

// For demo purposes, use a fixed date
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