use anchor_lang::prelude::*;

// Constants to limit collection sizes - drastically reduced
// Use small array sizes to avoid stack size issues
pub const MAX_ORGANIZATIONS: usize = 3; 
pub const MAX_EVENTS_PER_CATEGORY: usize = 3;

// Main registry that points to other accounts instead of storing all data
#[account]
pub struct Registry {
    pub authority: Pubkey,             // Admin who can manage the registry
    pub organization_count: u64,       // Total number of registered organizations
    pub organization_count_added: u64, // Count of organizations added to the array
    pub organizations: [Pubkey; MAX_ORGANIZATIONS], // Fixed-size array of organization IDs
    pub events_account: Pubkey,        // Points to a separate EventsRegistry account
    pub bump: u8,                      // PDA bump
}

// Events are stored in a separate account to reduce stack size
#[account]
pub struct EventsRegistry {
    pub upcoming_event_count: u64,
    pub upcoming_events: [Pubkey; MAX_EVENTS_PER_CATEGORY],
    pub ongoing_event_count: u64,
    pub ongoing_events: [Pubkey; MAX_EVENTS_PER_CATEGORY],
    pub finished_event_count: u64,
    pub finished_events: [Pubkey; MAX_EVENTS_PER_CATEGORY],
    pub bump: u8,
}

#[account]
pub struct OrganizationInfo {
    pub id: u64,                  // Unique identifier
    pub name: String,             // Organization name (max 50 chars)
    pub owner: Pubkey,            // Organization owner wallet
    pub description: String,      // Brief description (max 200 chars)
    pub kyc_verified: bool,       // KYC verification status
    pub org_program_id: Pubkey,   // Address of organization's program
    pub bump: u8,                 // PDA bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum EventStatus {
    Upcoming,
    Ongoing,
    Finished,
}