'use client';

import React, { useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState, useEffect } from 'react';

// Import the wallet adapter CSS but we'll override the styling
import '@solana/wallet-adapter-react-ui/styles.css';

export default function WalletConnect() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  // Only render the component after client-side hydration
  useEffect(() => {
    setReady(true);
  }, []);

  // Get wallet balance
  const getBalance = useCallback(async () => {
    if (publicKey && connection) {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      }
    } else {
      setBalance(null);
    }
  }, [connection, publicKey]);

  // Update balance when wallet connects/disconnects
  useEffect(() => {
    if (connected) {
      getBalance();
      // Set up interval to refresh balance every 20 seconds
      const intervalId = setInterval(getBalance, 20000);
      return () => clearInterval(intervalId);
    } else {
      setBalance(null);
    }
  }, [connected, getBalance]);

  // Custom styles for the wallet button
  const buttonStyle = useMemo(() => ({
    fontSize: '14px',
    borderRadius: '8px',
    height: '40px', 
    border: 'none',
    background: connected ? '#4F46E5' : '#4F46E5',
    transition: 'all 0.2s ease',
  }), [connected]);

  // Don't render anything until client-side hydration is complete
  if (!ready) {
    return null;
  }

  return (
    <div className="relative">
      <WalletMultiButton
        style={buttonStyle}
        className="wallet-button"
        startIcon={undefined}
      />
      
      {connected && balance !== null && (
        <div className="absolute -bottom-6 right-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
          {balance.toFixed(2)} SOL
        </div>
      )}
      
      {/* Custom styles to override the default wallet adapter styles */}
      <style jsx global>{`
        .wallet-button {
          color: white !important;
          font-family: inherit !important;
          font-weight: 500 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        .wallet-button:hover {
          background-color: #4338CA !important;
          opacity: 0.9 !important;
        }
        
        /* Override the text in the button to show "Connect" when not connected */
        .wallet-adapter-button:not([data-connected]) .wallet-adapter-button-text::before {
          content: "Connect" !important;
        }
        
        .wallet-adapter-dropdown-list {
          border-radius: 10px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          animation: fadeIn 0.2s ease-out !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          padding: 6px !important;
          background-color: white !important;
        }
        
        .wallet-adapter-dropdown-list-item {
          border-radius: 6px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          color: #1F2937 !important;
          padding: 12px 16px !important;
          margin: 2px 0 !important;
        }
        
        .wallet-adapter-dropdown-list-item:hover {
          background-color: #F3F4F6 !important;
          color: #4F46E5 !important;
        }
        
        .wallet-adapter-button-start-icon {
          margin-right: 8px !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}