'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrganizationData } from '@/components/organizations/OrganizationGrid';
import OrganizationGrid from '@/components/organizations/OrganizationGrid';
import { getAllOrganizations } from '@/services/organizationService';
import { useWallet } from '@solana/wallet-adapter-react';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const wallet = useWallet();
  
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const data = await getAllOrganizations(wallet);
        setOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrganizations();
  }, [wallet, wallet.connected]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Link 
          href="/organizations/register" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Register Organization
        </Link>
      </div>
      
      {!wallet.connected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <p className="text-sm text-yellow-700">
              Connect your wallet to see blockchain organizations. Showing mock data for now.
            </p>
          </div>
        </div>
      )}
      
      <OrganizationGrid organizations={organizations} title="Verified Organizations" />
    </div>
  );
}