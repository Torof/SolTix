use anchor_lang::prelude::*;
use crate::state::{Registry, EventsRegistry, MAX_ORGANIZATIONS, MAX_EVENTS_PER_CATEGORY};

// First instruction: Initialize the main Registry account
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + (32 * MAX_ORGANIZATIONS) + 32 + 1, // Reduced size
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,
    
    pub system_program: Program<'info, System>,
}

// Second instruction: Initialize the Events Registry separately
#[derive(Accounts)]
pub struct InitializeEvents<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"registry"],
        bump = registry.bump,
        constraint = registry.authority == authority.key()
    )]
    pub registry: Account<'info, Registry>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 8 + (32 * MAX_EVENTS_PER_CATEGORY) + 
                8 + (32 * MAX_EVENTS_PER_CATEGORY) +
                8 + (32 * MAX_EVENTS_PER_CATEGORY) + 1,
        seeds = [b"events_registry"],
        bump
    )]
    pub events_registry: Account<'info, EventsRegistry>,
    
    pub system_program: Program<'info, System>,
}

// Handler for initializing the main Registry account
pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    let authority = &ctx.accounts.authority;
    
    registry.authority = authority.key();
    registry.organization_count = 0;
    registry.organization_count_added = 0;
    
    // Initialize array with default values
    registry.organizations = [Pubkey::default(); MAX_ORGANIZATIONS];
    
    // The events_account will be set when InitializeEvents is called
    registry.events_account = Pubkey::default();
    
    registry.bump = ctx.bumps.registry;
    
    msg!("Registry initialized with authority: {}", authority.key());
    Ok(())
}

// Handler for initializing the Events Registry account
pub fn initialize_events_handler(ctx: Context<InitializeEvents>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    let events_registry = &mut ctx.accounts.events_registry;
    
    // Set events registry in main registry
    registry.events_account = events_registry.key();
    
    // Initialize event arrays
    events_registry.upcoming_event_count = 0;
    events_registry.upcoming_events = [Pubkey::default(); MAX_EVENTS_PER_CATEGORY];
    
    events_registry.ongoing_event_count = 0;
    events_registry.ongoing_events = [Pubkey::default(); MAX_EVENTS_PER_CATEGORY];
    
    events_registry.finished_event_count = 0;
    events_registry.finished_events = [Pubkey::default(); MAX_EVENTS_PER_CATEGORY];
    
    events_registry.bump = ctx.bumps.events_registry;
    
    msg!("Events registry initialized");
    Ok(())
}