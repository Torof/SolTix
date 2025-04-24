use anchor_lang::prelude::*;

#[account]
pub struct EventManager {
    pub authority: Pubkey,        // Admin authority
    pub ticket_count: u64,        // Total tickets minted
    pub bump: u8,                 // PDA bump
}

#[account]
pub struct Ticket {
    pub buyer: Pubkey,            // Ticket owner
    pub event: Pubkey,            // Event account address
    pub event_id: Pubkey,         // Event ID for lookup
    pub used: bool,               // Whether the ticket has been used
    pub bump: u8,                 // PDA bump
}