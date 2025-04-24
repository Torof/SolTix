use anchor_lang::prelude::*;

declare_id!("FckJnm69ZRMy84E6PGxzb8b1vBa9WMRw4E8EsjkJifr"); // Replace with your actual program ID

pub mod state;
pub mod errors;

// Use the full path to the error enum
use crate::errors::OrganizationError;

#[program]
pub mod soltix_organization {
    use super::*;
    
    // Initialize organization
    pub fn initialize(ctx: Context<Initialize>, name: String, metadata_uri: String) -> Result<()> {
        let organization = &mut ctx.accounts.organization;
        let owner = &ctx.accounts.owner;
        
        organization.owner = owner.key();
        organization.name = name;
        organization.metadata_uri = metadata_uri;
        organization.event_count = 0;
        organization.bump = ctx.bumps.organization;
        
        msg!("Organization initialized: {}", organization.name);
        Ok(())
    }
    
    // Update organization metadata
    pub fn update_metadata(
        ctx: Context<UpdateMetadata>,
        name: String,
        metadata_uri: String,
    ) -> Result<()> {
        let organization = &mut ctx.accounts.organization;
        
        organization.name = name;
        organization.metadata_uri = metadata_uri;
        
        msg!("Organization metadata updated: {}", organization.name);
        Ok(())
    }
    
    // Create event
    pub fn create_event(
        ctx: Context<CreateEvent>,
        name: String, 
        description: String,
        location: String,
        date: i64,
        price: u64,
        max_capacity: u32,
        ticket_metadata_uri: String,
    ) -> Result<()> {
        let organization = &mut ctx.accounts.organization;
        let event = &mut ctx.accounts.event;
        let owner = &ctx.accounts.owner;
        
        // Set event info
        event.owner = owner.key();
        event.organization = organization.key();
        event.name = name;
        event.description = description;
        event.location = location;
        event.date = date;
        event.price = price;
        event.max_capacity = max_capacity;
        event.current_capacity = 0;
        event.ticket_metadata_uri = ticket_metadata_uri;
        event.sold_out = false;
        event.bump = ctx.bumps.event;
        
        // Increment event count
        organization.event_count += 1;
        
        msg!("Event created: {}", event.name);
        Ok(())
    }
}

// Account validation structures
#[derive(Accounts)]
#[instruction(name: String, metadata_uri: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 100 + 200 + 8 + 1, // Adjust space as needed
        seeds = [b"organization", owner.key().as_ref()],
        bump
    )]
    pub organization: Account<'info, state::Organization>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, metadata_uri: String)]
pub struct UpdateMetadata<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"organization", owner.key().as_ref()],
        bump = organization.bump,
        constraint = organization.owner == owner.key() @ OrganizationError::Unauthorized
    )]
    pub organization: Account<'info, state::Organization>,
}

#[derive(Accounts)]
#[instruction(name: String, description: String, location: String, date: i64, price: u64, max_capacity: u32, ticket_metadata_uri: String)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"organization", owner.key().as_ref()],
        bump = organization.bump,
        constraint = organization.owner == owner.key() @ OrganizationError::Unauthorized
    )]
    pub organization: Account<'info, state::Organization>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 100 + 500 + 200 + 8 + 8 + 4 + 4 + 200 + 1 + 1, // Adjust space as needed
        seeds = [b"event", organization.key().as_ref(), organization.event_count.to_le_bytes().as_ref()],
        bump
    )]
    pub event: Account<'info, state::Event>,
    
    pub system_program: Program<'info, System>,
}