import { OrganizationData } from '@/components/organizations/OrganizationGrid';
import { mockOrganizations } from '@/utils/mockData';

export async function getAllOrganizations(): Promise<OrganizationData[]> {
  // In the future, this would fetch organizations from your Solana program
  return mockOrganizations;
}

export async function getOrganizationById(id: string): Promise<OrganizationData | null> {
  // In the future, this would fetch a specific organization from your Solana program
  return mockOrganizations.find(org => org.id === id) || null;
}