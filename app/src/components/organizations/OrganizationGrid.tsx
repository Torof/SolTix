'use client';

import React from 'react';
import Link from 'next/link';

// Organization type definition
export interface OrganizationData {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  website: string;
  owner: string;
}

interface OrganizationGridProps {
  organizations: OrganizationData[];
  title: string;
}

export default function OrganizationGrid({ organizations, title }: OrganizationGridProps) {
  if (organizations.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">No organizations available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Link 
            href={`/organizations/${org.id}`} 
            key={org.id}
            className="transform transition duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={org.logoUrl || 'https://via.placeholder.com/300x150?text=Organization'} 
                  alt={org.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{org.name}</h3>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{org.description}</p>
                {org.website && (
                  <a 
                    href={org.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}