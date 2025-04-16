use anchor_lang::prelude::*;
use crate::{state::*, errors::*};

#[derive(Accounts)]
pub struct UpdateEventStatus<'info> {
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"registry"],
        bump = registry.bump,
        constraint = registry.authority == authority.key() @ RegistryError::Unauthorized
    )]
    pub registry: Account<'info, Registry>,
}

pub fn handler(
    ctx: Context<UpdateEventStatus>,
    event_id: Pubkey,
    new_status: EventStatus,
) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    
    // Find and remove the event from its current status list
    if let Some(pos) = registry.upcoming_events.iter().position(|&id| id == event_id) {
        registry.upcoming_events.remove(pos);
    } else if let Some(pos) = registry.ongoing_events.iter().position(|&id| id == event_id) {
        registry.ongoing_events.remove(pos);
    } else if let Some(pos) = registry.finished_events.iter().position(|&id| id == event_id) {
        registry.finished_events.remove(pos);
    } else {
        return err!(RegistryError::EventNotFound);
    }
    
    // Add the event to its new status list
    match new_status {
        EventStatus::Upcoming => registry.upcoming_events.push(event_id),
        EventStatus::Ongoing => registry.ongoing_events.push(event_id),
        EventStatus::Finished => registry.finished_events.push(event_id),
    }
    
    msg!("Event status updated: {:?}", new_status);
    Ok(())
}