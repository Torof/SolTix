'use client';

import axios from 'axios';

// Pinata API configuration
const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || '';

// Interface for organization metadata
interface OrganizationMetadata {
  name: string;
  description: string;
  logo: string | null;
  banner: string | null;
  website: string;
  email: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    discord: string;
  };
  owner: string;
  createdAt: string;
}

export async function uploadToIPFS(metadata: OrganizationMetadata | any): Promise<string> {
  try {
    // Upload to Pinata
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    
    const response = await axios.post(
      url,
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      }
    );
    
    // Return the IPFS URI
    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

export async function fetchFromIPFS(uri: string): Promise<any> {
  try {
    // Extract CID from IPFS URI
    const cid = uri.replace('ipfs://', '').split('/')[0];
    
    // Fetch the file from IPFS gateway (using Pinata gateway)
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch metadata: ${res.statusText}`);
    }
    
    // Parse the JSON response
    const metadata = await res.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch metadata from IPFS');
  }
}