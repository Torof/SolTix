'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import the wallet provider with SSR disabled
const WalletContextProviderDynamic = dynamic(
  async () => {
    const { WalletContextProvider } = await import('@/contexts/WalletContextProvider');
    return { default: WalletContextProvider };
  },
  { ssr: false }
);

export default function WalletProvider({ children }: { children: ReactNode }) {
  return <WalletContextProviderDynamic>{children}</WalletContextProviderDynamic>;
}