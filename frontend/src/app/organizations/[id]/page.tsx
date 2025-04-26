'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrganizationById } from '@/services/organizationService';
import { getUpcomingEvents, getOngoingEvents } from '@/services/eventService';
import { OrganizationData } from '@/components/organizations/OrganizationGrid';
import { EventData } from '@/components/events/EventCarousel';
import EventCarousel from '@/components/events/EventCarousel';
import EventGrid from '@/components/events/EventGrid';
import { useWallet } from '@solana/wallet-adapter-react';

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const wallet = useWallet();

  useEffect(() => {
    async function fetchData() {
      try {
        const orgData = await getOrganizationById(id as string, wallet);
        setOrganization(orgData);
        
        if (orgData) {
          // Get events for this organization
          const allUpcoming = await getUpcomingEvents(wallet);
          const allOngoing = await getOngoingEvents(wallet);
          
          const upcoming = allUpcoming.filter(
            event => event.organizationId === orgData.id
          );
          
          const ongoing = allOngoing.filter(
            event => event.organizationId === orgData.id
          );
          
          setUpcomingEvents(upcoming);
          setOngoingEvents(ongoing);
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id, wallet, wallet.connected]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Organization Not Found</h1>
          <p className="text-gray-600 mb-8">The organization you're looking for doesn't exist or has been removed.</p>
          <Link href="/organizations" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Browse all organizations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/organizations" className="text-indigo-600 hover:text-indigo-800">
          ← Back to organizations
        </Link>
      </div>
      
      {!wallet.connected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <p className="text-sm text-yellow-700">
              Connect your wallet to see blockchain data. Showing mock data for now.
            </p>
          </div>
        </div>
      )}
      
      {/* Organization Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="h-64 overflow-hidden">
          <img 
            src={organization.banner || 'https://via.placeholder.com/1200x400?text=Organization+Banner'} 
            alt={`${organization.name} banner`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white mr-4">
              <img 
                src={organization.logo || 'https://via.placeholder.com/100?text=Logo'} 
                alt={`${organization.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{organization.name}</h1>
              {organization.website && (
                <a 
                  href={organization.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-100 text-sm"
                >
                  {organization.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Organization Description */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-gray-700">{organization.description}</p>
      </div>
      
      {/* Organization Events */}
      <div className="mb-4">
        <EventCarousel events={upcomingEvents} title="Upcoming Events" />
      </div>
      
      <div className="my-8 border-t border-gray-200"></div>
      
      <EventGrid events={ongoingEvents} title="Ongoing Events" />
    </div>
  );
}