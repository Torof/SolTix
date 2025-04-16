use anchor_lang::prelude::*;

#[account]
pub struct Registry {
    pub authority: Pubkey,                   // Admin who can manage the registry
    pub organization_count: u64,             // Total number of registered organizations
    pub organizations: Vec<Pubkey>,          // List of registered organizations
    pub upcoming_events: Vec<Pubkey>,        // List of upcoming event accounts
    pub ongoing_events: Vec<Pubkey>,         // List of ongoing events
    pub finished_events: Vec<Pubkey>,        // List of finished events
    pub bump: u8,                            // PDA bump
}

#[account]
pub struct OrganizationInfo {
    pub id: u64,                             // Unique identifier
    pub name: String,                        // Organization name (max 50 chars)
    pub owner: Pubkey,                       // Organization owner wallet
    pub description: String,                 // Brief description (max 200 chars)
    pub kyc_verified: bool,                  // KYC verification status
    pub org_program_id: Pubkey,              // Address of organization's program
    pub bump: u8,                            // PDA bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EventStatus {
    Upcoming,
    Ongoing,
    Finished,
}