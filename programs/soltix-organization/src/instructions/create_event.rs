use anchor_lang::prelude::*;
use crate::{state::*, errors::*};

#[derive(Accounts)]
#[instruction(
    name: String,
    metadata_uri: String,
    start_time: i64,
    end_time: i64,
    total_tickets: u64,
    ticket_price: u64,
)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"organization_data", owner.key().as_ref()],
        bump = organization_data.bump,
        constraint = organization_data.owner == owner.key() @ OrganizationError::Unauthorized
    )]
    pub organization_data: Account<'info, OrganizationData>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 8 + 50 + 32 + 200 + 8 + 8 + 8 + 8 + 8 + 32 + 1, // estimate space
        seeds = [b"event", organization_data.key().as_ref(), organization_data.event_count.to_le_bytes().as_ref()],
        bump
    )]
    pub event_info: Account<'info, EventInfo>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateEvent>,
    name: String,
    metadata_uri: String,
    start_time: i64,
    end_time: i64,
    total_tickets: u64,
    ticket_price: u64,
) -> Result<()> {
    // Validate inputs
    if name.len() > 50 {
        return err!(OrganizationError::NameTooLong);
    }
    if metadata_uri.len() > 200 {
        return err!(OrganizationError::UriTooLong);
    }
    if end_time <= start_time {
        return err!(OrganizationError::InvalidTimeRange);
    }
    
    let org_data = &mut ctx.accounts.organization_data;
    let event = &mut ctx.accounts.event_info;
    
    // Initialize event data
    event.id = org_data.event_count;
    event.name = name;
    event.organization = org_data.key();
    event.metadata_uri = metadata_uri;
    event.start_time = start_time;
    event.end_time = end_time;
    event.total_tickets = total_tickets;
    event.remaining_tickets = total_tickets;
    event.ticket_price = ticket_price;
    event.event_program_id = Pubkey::default(); // Will be updated when event program is deployed
    event.bump = *ctx.bumps.get("event_info").unwrap();
    
    // Update organization data
    org_data.events.push(event.key());
    org_data.event_count += 1;
    
    msg!("Event created: {}", event.name);
    Ok(())
}