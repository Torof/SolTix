'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { registerOrganization } from '@/services/organizationService';
import { uploadToIPFS, uploadImageToIPFS } from '@/utils/ipfs';

// Define the network directly to avoid import issues
const NETWORK = clusterApiUrl('devnet');

export default function OrganizationForm() {
  const router = useRouter();
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    twitter: '',
    discord: '',
    instagram: ''
  });
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [ipfsUri, setIpfsUri] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet to register an organization');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload logo and banner to IPFS if provided
      let logoUrl = '';
      let bannerUrl = '';
      
      if (logoFile) {
        try {
          toast.loading('Uploading logo to IPFS...');
          logoUrl = await uploadImageToIPFS(logoFile);
          toast.dismiss();
          toast.success('Logo uploaded to IPFS');
          console.log('Logo URL:', logoUrl);
        } catch (err) {
          console.error('Error uploading logo:', err);
          toast.error('Error uploading logo image');
        }
      }
      
      if (bannerFile) {
        try {
          toast.loading('Uploading banner to IPFS...');
          bannerUrl = await uploadImageToIPFS(bannerFile);
          toast.dismiss();
          toast.success('Banner uploaded to IPFS');
          console.log('Banner URL:', bannerUrl);
        } catch (err) {
          console.error('Error uploading banner:', err);
          toast.error('Error uploading banner image');
        }
      }
      
      // Create metadata for IPFS
      const metadata = {
        name: formData.name,
        description: formData.description,
        logo: logoUrl,
        banner: bannerUrl,
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
      setIpfsUri(metadataUri);
      console.log('Metadata URI:', metadataUri);
      
      // Register organization on Solana
      toast.loading('Registering organization on blockchain...');
      
      // Create a connection directly in case of issues
      const connection = new Connection(NETWORK);
      
      const result = await registerOrganization(
        formData.name,
        formData.description,
        metadataUri,
        wallet
      );
      
      toast.dismiss();
      
      if (result.success) {
        toast.success('Organization registered successfully!');
        // Redirect to the organization page or dashboard
        setTimeout(() => {
          router.push(`/organizations/${result.organizationId}`);
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to register organization');
      }
    } catch (error: any) {
      toast.dismiss();
      console.error('Error registering organization:', error);
      toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!connected ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <p className="text-yellow-700">
            Please connect your wallet to register an organization.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
            Organization Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={loading || !connected}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your organization's name"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={loading || !connected}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tell us about your organization"
          />
        </div>
        
        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Logo
          </label>
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => connected && logoInputRef.current?.click()}
              className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${!connected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-500 text-sm text-center">Click to upload</span>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={loading || !connected}
              className="hidden"
            />
            <div className="text-sm text-gray-500">
              Recommended: Square image, at least 300x300px
            </div>
          </div>
        </div>
        
        {/* Banner Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Banner Image
          </label>
          <div 
            onClick={() => connected && bannerInputRef.current?.click()}
            className={`h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${!connected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-gray-500 text-sm">Click to upload a banner image</span>
            )}
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            disabled={loading || !connected}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-1">
            Recommended: 1200x400px
          </p>
        </div>
        
        {/* Contact & Social Media */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Contact & Social Media</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="website">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              disabled={loading || !connected}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://your-website.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Contact Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || !connected}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="contact@your-organization.com"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="twitter">
                Twitter
              </label>
              <input
                id="twitter"
                name="twitter"
                type="text"
                value={formData.twitter}
                onChange={handleChange}
                disabled={loading || !connected}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="@username"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="instagram">
                Instagram
              </label>
              <input
                id="instagram"
                name="instagram"
                type="text"
                value={formData.instagram}
                onChange={handleChange}
                disabled={loading || !connected}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="@username"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="discord">
                Discord
              </label>
              <input
                id="discord"
                name="discord"
                type="text"
                value={formData.discord}
                onChange={handleChange}
                disabled={loading || !connected}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://discord.gg/..."
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !connected}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Organization'}
          </button>
        </div>
      </form>
      
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