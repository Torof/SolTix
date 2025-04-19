'use client';

import OrganizationForm from '@/components/forms/OrganizationForm';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

// Dynamically import our custom wallet button
const WalletConnectDynamic = dynamic(
  () => import('@/components/ui/WalletConnect'),
  { ssr: false }
);

export default function RegisterOrganization() {
  const { connected } = useWallet();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Register Your Organization</h1>
      
      {!connected && (
        <div className="max-w-md mx-auto mb-8 bg-indigo-50 p-6 rounded-lg text-center">
          <p className="text-indigo-700 mb-4">
            Connect your wallet to register an organization
          </p>
          <div className="flex justify-center">
            <WalletConnectDynamic />
          </div>
        </div>
      )}
      
      <OrganizationForm />
    </div>
  );
}