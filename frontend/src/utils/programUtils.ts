import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { SoltixRegistry, IDL as RegistryIDL } from '../idl/registry-idl';
import { SoltixOrganization, IDL as OrganizationIDL } from '../idl/organization-idl';
import { SoltixEvent, IDL as EventIDL } from '../idl/event-idl';

// Program Public Keys (from Anchor.toml)
export const REGISTRY_PROGRAM_ID = new PublicKey('D2NYqvWuESxqGrb6qptuv5Y1cyP7GBzMgxEhHwVPzKFj');
export const ORGANIZATION_PROGRAM_ID = new PublicKey('8b8ABhBP9bNnBhmFD56aZsR3cxYczTsWzC9pAEM3hndu');
export const EVENT_PROGRAM_ID = new PublicKey('DkNhrtj1bZwW1ukGJooFimiC5PQ4YhyaNEz3bxT8aUhP');

// Use Devnet for now
export const NETWORK = clusterApiUrl('devnet');

// Get Anchor provider from the wallet and connection
export const getProvider = (wallet: any, connection: Connection) => {
  if (!wallet || !wallet.publicKey) {
    return null;
  }
  
  return new AnchorProvider(
    connection,
    wallet as any,
    { commitment: 'processed' }
  );
};

// For TypeScript to understand what we're doing
type AnchorProgram = ReturnType<typeof Program.at>;

// Get the registry program
export const getRegistryProgram = (provider: AnchorProvider | null): AnchorProgram | null => {
  if (!provider) return null;
  // Create program using Program.at() method which has different typing
  return Program.at(
    REGISTRY_PROGRAM_ID.toString(),
    provider
  );
};

// Get the organization program
export const getOrganizationProgram = (provider: AnchorProvider | null): AnchorProgram | null => {
  if (!provider) return null;
  // Create program using Program.at() method which has different typing
  return Program.at(
    ORGANIZATION_PROGRAM_ID.toString(),
    provider
  );
};

// Get the event program
export const getEventProgram = (provider: AnchorProvider | null): AnchorProgram | null => {
  if (!provider) return null;
  // Create program using Program.at() method which has different typing
  return Program.at(
    EVENT_PROGRAM_ID.toString(),
    provider
  );
};

// Helper function to get the registry PDA
export const getRegistryPDA = () => {
  const [registryPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('registry')],
    REGISTRY_PROGRAM_ID
  );
  return registryPDA;
};

// Helper function to get the events registry PDA
export const getEventsRegistryPDA = () => {
  const [eventsRegistryPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('events_registry')],
    REGISTRY_PROGRAM_ID
  );
  return eventsRegistryPDA;
};

// Helper function to get organization PDA
export const getOrganizationPDA = (owner: PublicKey) => {
  const [organizationPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('organization'), owner.toBuffer()],
    ORGANIZATION_PROGRAM_ID
  );
  return organizationPDA;
};

// Helper function to get event PDA
export const getEventPDA = (organizationPDA: PublicKey, eventCount: number) => {
  const [eventPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('event'),
      organizationPDA.toBuffer(),
      Buffer.from(eventCount.toString())
    ],
    ORGANIZATION_PROGRAM_ID
  );
  return eventPDA;
};

// Helper function to get ticket PDA
export const getTicketPDA = (eventPDA: PublicKey, buyer: PublicKey) => {
  const [ticketPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('ticket'), eventPDA.toBuffer(), buyer.toBuffer()],
    EVENT_PROGRAM_ID
  );
  return ticketPDA;
};

// Helper function to get event manager PDA
export const getEventManagerPDA = () => {
  const [eventManagerPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('event_manager')],
    EVENT_PROGRAM_ID
  );
  return eventManagerPDA;
};