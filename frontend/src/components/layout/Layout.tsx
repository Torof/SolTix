'use client'

import { FC, ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: FC<LayoutProps> = ({ children, title = 'SolTix' }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title} | SolTix</title>
        <meta name="description" content="Decentralized event ticketing on Solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;