import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { 
  getProvider, 
  getOrganizationProgram, 
  getRegistryProgram,
  getOrganizationPDA,
  getRegistryPDA,
  NETWORK
} from '@/utils/programUtils';
import { uploadToIPFS, fetchFromIPFS } from '@/utils/ipfs';
import { mockOrganizations } from '@/utils/mockData';
import { OrganizationData } from '@/components/organizations/OrganizationGrid';

// Define the registry account structure
interface RegistryAccount {
  authority: PublicKey;
  organizationCount: BN;
  organizationCountAdded: BN;
  organizations: PublicKey[];
  eventsAccount: PublicKey;
  bump: number;
}

// Define the organization info account structure
interface OrganizationInfoAccount {
  id: BN;
  name: string;
  owner: PublicKey;
  description: string;
  kycVerified: boolean;
  orgProgramId: PublicKey;
  bump: number;
}

// Define the organization account structure
interface OrganizationAccount {
  owner: PublicKey;
  name: string;
  metadataUri: string;
  eventCount: BN;
  bump: number;
}

// Use mockData for fallback or when wallet not connected
export async function getAllOrganizations(wallet?: any): Promise<OrganizationData[]> {
  // If no wallet is connected, return mock data
  if (!wallet || !wallet.publicKey) {
    console.log('No wallet connected, using mock data');
    return mockOrganizations;
  }

  try {
    const connection = new Connection(NETWORK);
    const provider = getProvider(wallet, connection);
    const registryProgram = getRegistryProgram(provider);
    
    if (!registryProgram) {
      return mockOrganizations;
    }
    
    // Get the registry PDA
    const registryPDA = getRegistryPDA();
    
    try {
      // Fetch the registry account data directly
      const registryAccountInfo = await connection.getAccountInfo(registryPDA);
      if (!registryAccountInfo) {
        console.error('Registry account not found');
        return mockOrganizations;
      }
      
      // Get organizations from mock data for now
      // In a real implementation, you would fetch and process each organization
      return mockOrganizations;
    } catch (err) {
      console.error('Error fetching registry:', err);
      return mockOrganizations;
    }
  } catch (error) {
    console.error('Error fetching organizations from blockchain:', error);
    // Fallback to mock data
    return mockOrganizations;
  }
}

export async function getOrganizationById(id: string, wallet?: any): Promise<OrganizationData | null> {
  // If no wallet is connected, return mock data
  if (!wallet || !wallet.publicKey) {
    return mockOrganizations.find(org => org.id === id) || null;
  }
  
  // For now, just return mock data
  // In a real implementation, you would fetch the organization by ID
  return mockOrganizations.find(org => org.id === id) || null;
}

// Register a new organization
export async function registerOrganization(
  name: string, 
  description: string, 
  metadataUri: string,
  wallet: any
): Promise<{ success: boolean, organizationId?: string, error?: string }> {
  if (!wallet || !wallet.publicKey) {
    return { success: false, error: 'Wallet not connected' };
  }
  
  try {
    const connection = new Connection(NETWORK);
    const provider = getProvider(wallet, connection);
    
    // Get the organization program
    const organizationProgram = getOrganizationProgram(provider);
    if (!organizationProgram) {
      return { success: false, error: 'Failed to get organization program' };
    }
    
    // Get the organization PDA
    const organizationPDA = getOrganizationPDA(wallet.publicKey);
    
    // Initialize the organization
    try {
      await organizationProgram.methods
        .initialize(name, metadataUri)
        .accounts({
          owner: wallet.publicKey,
          organization: organizationPDA,
          systemProgram: PublicKey.default,
        })
        .rpc();
      
      return { 
        success: true, 
        organizationId: organizationPDA.toString()
      };
    } catch (err: any) {
      console.error('Error initializing organization:', err);
      return { 
        success: false, 
        error: `Registration error: ${err.message || 'Unknown error'}`
      };
    }
  } catch (error: any) {
    console.error('Error registering organization on blockchain:', error);
    return { 
      success: false, 
      error: `Failed to register organization: ${error.message || 'Unknown error'}` 
    };
  }
}

// Update organization metadata
export async function updateOrganizationMetadata(
  name: string,
  metadataUri: string,
  wallet: any
): Promise<{ success: boolean, error?: string }> {
  if (!wallet || !wallet.publicKey) {
    return { success: false, error: 'Wallet not connected' };
  }
  
  try {
    const connection = new Connection(NETWORK);
    const provider = getProvider(wallet, connection);
    
    // Get the organization program
    const organizationProgram = getOrganizationProgram(provider);
    if (!organizationProgram) {
      return { success: false, error: 'Failed to get organization program' };
    }
    
    // Get the organization PDA
    const organizationPDA = getOrganizationPDA(wallet.publicKey);
    
    // Update the organization metadata
    try {
      await organizationProgram.methods
        .updateMetadata(name, metadataUri)
        .accounts({
          owner: wallet.publicKey,
          organization: organizationPDA,
        })
        .rpc();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error updating organization metadata:', err);
      return { 
        success: false, 
        error: `Failed to update metadata: ${err.message || 'Unknown error'}` 
      };
    }
  } catch (error: any) {
    console.error('Error updating organization metadata:', error);
    return { 
      success: false, 
      error: `Failed to update organization metadata: ${error.message || 'Unknown error'}` 
    };
  }
}