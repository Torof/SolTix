'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'react-hot-toast';

export const useWalletConnection = () => {
  const { 
    publicKey, 
    wallet, 
    disconnect, 
    connected, 
    connecting, 
    select, 
    wallets, 
    connect 
  } = useWallet();
  
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Format wallet address to show first and last few characters
  const shortenAddress = useCallback((address: string, chars = 4) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }, []);

  // Format the address for display
  const formattedAddress = publicKey ? shortenAddress(publicKey.toString()) : '';

  // Fetch user's balance
  const fetchBalance = useCallback(async () => {
    if (publicKey && connection) {
      try {
        setLoading(true);
        const balanceResponse = await connection.getBalance(publicKey);
        setBalance(balanceResponse / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast.error('Failed to fetch wallet balance');
      } finally {
        setLoading(false);
      }
    } else {
      setBalance(null);
    }
  }, [publicKey, connection]);

  // Connect to wallet
  const handleConnect = useCallback(async (walletName: string) => {
    try {
      const selectedWallet = wallets.find(w => w.adapter.name === walletName);
      if (selectedWallet) {
        select(selectedWallet.adapter.name);
        await connect();
        toast.success('Wallet connected successfully!');
      }
    } catch (error: any) {
      console.error('Error connecting to wallet:', error);
      toast.error(error?.message || 'Failed to connect wallet');
    }
  }, [wallets, select, connect]);

  // Disconnect wallet
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnect]);

  // Update balance when connection or wallet changes
  useEffect(() => {
    if (connected) {
      fetchBalance();
    }
  }, [connected, fetchBalance]);

  return {
    publicKey,
    connected,
    connecting,
    wallet,
    balance,
    formattedAddress,
    loading,
    wallets,
    handleConnect,
    handleDisconnect,
    fetchBalance
  };
};