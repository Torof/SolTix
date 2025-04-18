import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import WalletProvider from '@/components/providers/WalletProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolTix - Decentralized Event Ticketing',
  description: 'Buy and sell event tickets on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}