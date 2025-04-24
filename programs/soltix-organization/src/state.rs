use anchor_lang::prelude::*;

#[account]
pub struct Organization {
    pub owner: Pubkey,           // Owner's wallet
    pub name: String,            // Organization name
    pub metadata_uri: String,    // URI to metadata (IPFS, Arweave, etc.)
    pub event_count: u64,        // Count of events created
    pub bump: u8,                // PDA bump
}

#[account]
pub struct Event {
    pub owner: Pubkey,             // Event creator (should match organization owner)
    pub organization: Pubkey,      // Organization account address
    pub name: String,              // Event name
    pub description: String,       // Event description
    pub location: String,          // Physical or virtual location
    pub date: i64,                 // Unix timestamp
    pub price: u64,                // Price in lamports
    pub max_capacity: u32,         // Maximum attendees
    pub current_capacity: u32,     // Current attendees
    pub ticket_metadata_uri: String, // URI to ticket metadata
    pub sold_out: bool,            // Whether the event is sold out
    pub bump: u8,                  // PDA bump
}