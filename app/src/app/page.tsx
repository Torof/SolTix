'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <main className="flex w-full max-w-4xl flex-col items-center">
        <h1 className="text-5xl font-bold text-center mb-6">
          Welcome to <span className="text-indigo-600">SolTix</span>
        </h1>
        
        <p className="text-xl text-center max-w-2xl mb-12">
          The decentralized ticketing platform built on Solana. Buy, sell, and manage event tickets as NFTs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link 
            href="/events"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-lg font-medium text-center"
          >
            Explore Events
          </Link>
          
          <Link 
            href="/organizations/register"
            className="px-8 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-200 text-lg font-medium text-center"
          >
            Register Organization
          </Link>
        </div>
      </main>
    </div>
  );
}