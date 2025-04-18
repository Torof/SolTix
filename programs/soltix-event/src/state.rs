use anchor_lang::prelude::*;

#[account]
pub struct EventData {
    pub name: String,                 // Event name
    pub organization: Pubkey,         // Organization that created this event
    pub metadata_uri: String,         // URI pointing to off-chain metadata
    pub start_time: i64,              // Event start timestamp
    pub end_time: i64,                // Event end timestamp
    pub total_tickets: u64,           // Total number of tickets available
    pub remaining_tickets: u64,       // Number of tickets still available
    pub ticket_price: u64,            // Price in lamports
    pub tickets_minted: u64,          // Counter for ticket numbers
    pub collection_mint: Pubkey,      // NFT collection for tickets
    pub bump: u8,                     // PDA bump
}