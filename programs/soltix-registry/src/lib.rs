use anchor_lang::prelude::*;

declare_id!("EpkzAK8Q6MsUcLqXxBoJeat5FDRoRWeHxvShHV7nAoF8");

pub mod state;
pub mod errors;

#[program]
pub mod soltix_registry {
    use super::*;
    
    // Initialize Registry account
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        let authority = &ctx.accounts.authority;
        
        registry.authority = authority.key();
        registry.organization_count = 0;
        registry.organization_count_added = 0;
        
        // Initialize array with default values
        registry.organizations = [Pubkey::default(); state::MAX_ORGANIZATIONS];
        
        // The events_account will be set when initialize_events is called
        registry.events_account = Pubkey::default();
        
        // Access bump correctly
        registry.bump = ctx.bumps.registry;
        
        msg!("Registry initialized with authority: {}", authority.key());
        Ok(())
    }
    
    // Initialize Events Registry account
    pub fn initialize_events(ctx: Context<InitializeEvents>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        let events_registry = &mut ctx.accounts.events_registry;
        
        // Set events registry in main registry
        registry.events_account = events_registry.key();
        
        // Initialize event arrays
        events_registry.upcoming_event_count = 0;
        events_registry.upcoming_events = [Pubkey::default(); state::MAX_EVENTS_PER_CATEGORY];
        
        events_registry.ongoing_event_count = 0;
        events_registry.ongoing_events = [Pubkey::default(); state::MAX_EVENTS_PER_CATEGORY];
        
        events_registry.finished_event_count = 0;
        events_registry.finished_events = [Pubkey::default(); state::MAX_EVENTS_PER_CATEGORY];
        
        // Access bump correctly
        events_registry.bump = ctx.bumps.events_registry;
        
        msg!("Events registry initialized");
        Ok(())
    }

    // Register new organization
    pub fn register_organization(
        ctx: Context<RegisterOrganization>,
        name: String,
        description: String,
    ) -> Result<()> {
        // Validate inputs
        if name.len() > 50 {
            return err!(errors::RegistryError::NameTooLong);
        }
        if description.len() > 200 {
            return err!(errors::RegistryError::DescriptionTooLong);
        }
        
        let registry = &mut ctx.accounts.registry;
        let org_info = &mut ctx.accounts.organization_info;
        let owner = &ctx.accounts.owner;
        
        // Set organization info
        org_info.id = registry.organization_count;
        org_info.name = name;
        org_info.owner = owner.key();
        org_info.description = description;
        org_info.kyc_verified = true; // For demo purposes, auto-verify
        org_info.org_program_id = Pubkey::default(); // Will be updated when org program is deployed
        
        // Access bump correctly
        org_info.bump = ctx.bumps.organization_info;
        
        // Add organization to registry - fix borrow checker issues by storing the index first
        if registry.organization_count_added < state::MAX_ORGANIZATIONS as u64 {
            let index = registry.organization_count_added as usize;
            registry.organizations[index] = org_info.key();
            registry.organization_count_added += 1;
            registry.organization_count += 1;
        } else {
            return err!(errors::RegistryError::RegistryFull);
        }
        
        msg!("Organization registered: {}", org_info.name);
        Ok(())
    }

    // Update event status
    pub fn update_event_status(
        ctx: Context<UpdateEventStatus>,
        event_id: Pubkey,
        new_status: state::EventStatus,
    ) -> Result<()> {
        let events_registry = &mut ctx.accounts.events_registry;
        
        // Find and remove the event from its current category
        let mut found = false;
        
        // Check upcoming events
        for i in 0..events_registry.upcoming_event_count as usize {
            if events_registry.upcoming_events[i] == event_id {
                // Mark the position as default (removed)
                events_registry.upcoming_events[i] = Pubkey::default();
                
                // Shift all elements after this position
                for j in i..(events_registry.upcoming_event_count as usize - 1) {
                    events_registry.upcoming_events[j] = events_registry.upcoming_events[j + 1];
                }
                
                // Clear the last element and decrement count
                let last_index = events_registry.upcoming_event_count as usize - 1;
                events_registry.upcoming_events[last_index] = Pubkey::default();
                events_registry.upcoming_event_count -= 1;
                
                found = true;
                break;
            }
        }
        
        // If not found in upcoming, check ongoing
        if !found {
            for i in 0..events_registry.ongoing_event_count as usize {
                if events_registry.ongoing_events[i] == event_id {
                    // Same process as above
                    events_registry.ongoing_events[i] = Pubkey::default();
                    
                    for j in i..(events_registry.ongoing_event_count as usize - 1) {
                        events_registry.ongoing_events[j] = events_registry.ongoing_events[j + 1];
                    }
                    
                    let last_index = events_registry.ongoing_event_count as usize - 1;
                    events_registry.ongoing_events[last_index] = Pubkey::default();
                    events_registry.ongoing_event_count -= 1;
                    
                    found = true;
                    break;
                }
            }
        }
        
        // If not found in ongoing, check finished
        if !found {
            for i in 0..events_registry.finished_event_count as usize {
                if events_registry.finished_events[i] == event_id {
                    // Same process as above
                    events_registry.finished_events[i] = Pubkey::default();
                    
                    for j in i..(events_registry.finished_event_count as usize - 1) {
                        events_registry.finished_events[j] = events_registry.finished_events[j + 1];
                    }
                    
                    let last_index = events_registry.finished_event_count as usize - 1;
                    events_registry.finished_events[last_index] = Pubkey::default();
                    events_registry.finished_event_count -= 1;
                    
                    found = true;
                    break;
                }
            }
        }
        
        // Return error if event not found in any category
        if !found {
            return err!(errors::RegistryError::EventNotFound);
        }
        
        // Add the event to its new category
        match new_status {
            state::EventStatus::Upcoming => {
                if events_registry.upcoming_event_count >= state::MAX_EVENTS_PER_CATEGORY as u64 {
                    return err!(errors::RegistryError::CategoryFull);
                }
                let index = events_registry.upcoming_event_count as usize;
                events_registry.upcoming_events[index] = event_id;
                events_registry.upcoming_event_count += 1;
            },
            state::EventStatus::Ongoing => {
                if events_registry.ongoing_event_count >= state::MAX_EVENTS_PER_CATEGORY as u64 {
                    return err!(errors::RegistryError::CategoryFull);
                }
                let index = events_registry.ongoing_event_count as usize;
                events_registry.ongoing_events[index] = event_id;
                events_registry.ongoing_event_count += 1;
            },
            state::EventStatus::Finished => {
                if events_registry.finished_event_count >= state::MAX_EVENTS_PER_CATEGORY as u64 {
                    return err!(errors::RegistryError::CategoryFull);
                }
                let index = events_registry.finished_event_count as usize;
                events_registry.finished_events[index] = event_id;
                events_registry.finished_event_count += 1;
            }
        }
        
        msg!("Event status updated to {:?}", new_status);
        Ok(())
    }
}

// Account validation structures
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + (32 * state::MAX_ORGANIZATIONS) + 32 + 1, // Reduced size
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, state::Registry>,
    
    pub system_program: Program<'info, System>,
}

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
    pub registry: Account<'info, state::Registry>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 8 + (32 * state::MAX_EVENTS_PER_CATEGORY) + 
                8 + (32 * state::MAX_EVENTS_PER_CATEGORY) +
                8 + (32 * state::MAX_EVENTS_PER_CATEGORY) + 1,
        seeds = [b"events_registry"],
        bump
    )]
    pub events_registry: Account<'info, state::EventsRegistry>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, description: String)]
pub struct RegisterOrganization<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, state::Registry>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 8 + 50 + 32 + 200 + 1 + 32 + 1, // estimate space
        seeds = [b"organization", registry.organization_count.to_le_bytes().as_ref()],
        bump
    )]
    pub organization_info: Account<'info, state::OrganizationInfo>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(event_id: Pubkey, new_status: state::EventStatus)]
pub struct UpdateEventStatus<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"registry"],
        bump = registry.bump,
        constraint = registry.authority == authority.key() @ errors::RegistryError::Unauthorized
    )]
    pub registry: Account<'info, state::Registry>,
    
    #[account(
        mut,
        seeds = [b"events_registry"],
        bump = events_registry.bump
    )]
    pub events_registry: Account<'info, state::EventsRegistry>,
}