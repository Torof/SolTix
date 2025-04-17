use anchor_lang::prelude::*;

#[account]
pub struct OrganizationData {
    pub name: String,                 // Short organization name
    pub owner: Pubkey,                // Organization owner/admin
    pub metadata_uri: String,         // URI pointing to off-chain metadata (IPFS/Arweave)
    pub event_count: u64,             // Total events created
    pub events: Vec<Pubkey>,          // List of all events created
    pub registry: Pubkey,             // Registry program that created this organization
    pub bump: u8,                     // PDA bump
}

#[account]
pub struct EventInfo {
    pub id: u64,                      // Unique identifier
    pub name: String,                 // Event name
    pub organization: Pubkey,         // Organization that created this event
    pub metadata_uri: String,         // URI pointing to off-chain metadata
    pub start_time: i64,              // Event start timestamp
    pub end_time: i64,                // Event end timestamp
    pub total_tickets: u64,           // Total number of tickets available
    pub remaining_tickets: u64,       // Number of tickets still available
    pub ticket_price: u64,            // Price in lamports
    pub event_program_id: Pubkey,     // Address of event's program
    pub bump: u8,                     // PDA bump
}