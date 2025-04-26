'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { uploadToIPFS } from '@/utils/ipfs';
import { useRouter } from 'next/navigation';
import { registerOrganization } from '@/services/organizationService';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function OrganizationForm() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [ipfsUri, setIpfsUri] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null as File | null,
    banner: null as File | null,
    website: '',
    email: '',
    twitter: '',
    instagram: '',
    discord: ''
  });

  // Preview for image uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          setPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Update form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Upload a file to IPFS via Pinata
  const uploadFileToIPFS = async (file: File): Promise<string> => {
    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
    const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || '';
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Configure pinata options
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', pinataOptions);
    
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data;`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
      return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading file to IPFS: ", error);
      throw new Error("Failed to upload image to IPFS");
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload images to IPFS if they exist
      let logoUri = null;
      let bannerUri = null;
      
      if (formData.logo) {
        toast.loading('Uploading logo to IPFS...');
        logoUri = await uploadFileToIPFS(formData.logo);
        toast.dismiss();
        toast.success('Logo uploaded to IPFS');
      }
      
      if (formData.banner) {
        toast.loading('Uploading banner to IPFS...');
        bannerUri = await uploadFileToIPFS(formData.banner);
        toast.dismiss();
        toast.success('Banner uploaded to IPFS');
      }
      
      // Prepare metadata with image URIs
      const metadata = {
        name: formData.name,
        description: formData.description,
        logo: logoUri,
        banner: bannerUri,
        website: formData.website,
        email: formData.email,
        socialLinks: {
          twitter: formData.twitter,
          instagram: formData.instagram,
          discord: formData.discord
        },
        owner: publicKey.toString(),
        createdAt: new Date().toISOString()
      };
      
      // Upload metadata to IPFS
      toast.loading('Uploading metadata to IPFS...');
      const metadataUri = await uploadToIPFS(metadata);
      toast.dismiss();
      toast.success('Organization metadata uploaded to IPFS');
      
      // Display the IPFS URI
      setIpfsUri(metadataUri);
      console.log('IPFS URI:', metadataUri);
      
      // Now register the organization on-chain
      toast.loading('Registering organization on the blockchain...');
      const result = await registerOrganization(
        formData.name,
        formData.description,
        metadataUri,
        // Pass the wallet object
        {
          publicKey,
          // Add any other wallet properties needed by registerOrganization
          connected,
          signTransaction: connected ? window.solana.signTransaction : null,
          signAllTransactions: connected ? window.solana.signAllTransactions : null
        }
      );
      
      toast.dismiss();
      
      if (result.success) {
        toast.success('Organization registered successfully on the blockchain!');
        
        // Redirect to organizations page after successful registration
        setTimeout(() => {
          router.push('/organizations');
        }, 2000);
      } else {
        toast.error(`Failed to register on blockchain: ${result.error}`);
      }
    } catch (error) {
      console.error('Error registering organization:', error);
      toast.error('Failed to register organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Register Your Organization</h1>
      
      {!connected ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Please connect your wallet to register an organization.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Media */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Media</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                  Logo (Recommended)
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    {preview ? (
                      <img src={preview} alt="Logo preview" className="h-full w-full object-cover" />
                    ) : (
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="banner" className="block text-sm font-medium text-gray-700">
                  Banner Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="banner" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input 
                          id="banner" 
                          name="banner" 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'banner')}
                          className="sr-only" 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Contact & Social</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                  Instagram
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="discord" className="block text-sm font-medium text-gray-700">
                  Discord
                </label>
                <input
                  type="text"
                  id="discord"
                  name="discord"
                  value={formData.discord}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="discord.gg/..."
                />
              </div>
            </div>
          </div>
          
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !connected}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register Organization'}
              </button>
            </div>
          </div>
        </form>
      )}
      
      {ipfsUri && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800 mb-2">Metadata uploaded successfully!</h3>
          <p className="text-sm text-green-700 mb-1">Your metadata is available at:</p>
          <div className="bg-white p-3 rounded border border-green-200 font-mono text-sm break-all">
            {ipfsUri}
          </div>
          <p className="mt-2 text-sm text-green-700">
            You can view your metadata at: 
            <a 
              href={`https://gateway.pinata.cloud/ipfs/${ipfsUri.replace('ipfs://', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-indigo-600 hover:text-indigo-800 underline"
            >
              Pinata Gateway
            </a>
          </p>
        </div>
      )}
    </div>
  );
}