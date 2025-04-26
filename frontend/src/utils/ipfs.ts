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

export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    // Create form data for the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata for better file management on Pinata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);
    
    // Optional pinning options
    const pinataOptions = JSON.stringify({
      cidVersion: 0
    });
    formData.append('pinataOptions', pinataOptions);
    
    // Upload to Pinata
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    
    const response = await axios.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        },
        maxContentLength: Infinity, // Allow large files
        maxBodyLength: Infinity
      }
    );
    
    // Return the IPFS URI
    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
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