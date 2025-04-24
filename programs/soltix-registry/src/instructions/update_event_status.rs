use anchor_lang::prelude::*;
use crate::state::{Registry, EventsRegistry, EventStatus, MAX_EVENTS_PER_CATEGORY};
use crate::errors::RegistryError;

#[derive(Accounts)]
#[instruction(event_id: Pubkey, new_status: EventStatus)]
pub struct UpdateEventStatus<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"registry"],
        bump = registry.bump,
        constraint = registry.authority == authority.key() @ RegistryError::Unauthorized
    )]
    pub registry: Account<'info, Registry>,
    
    #[account(
        mut,
        seeds = [b"events_registry"],
        bump = events_registry.bump
    )]
    pub events_registry: Account<'info, EventsRegistry>,
}

pub fn handler(
    ctx: Context<UpdateEventStatus>,
    event_id: Pubkey,
    new_status: EventStatus,
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
        return err!(RegistryError::EventNotFound);
    }
    
    // Add the event to its new category
    match new_status {
        EventStatus::Upcoming => {
            if events_registry.upcoming_event_count >= MAX_EVENTS_PER_CATEGORY as u64 {
                return err!(RegistryError::CategoryFull);
            }
            let index = events_registry.upcoming_event_count as usize;
            events_registry.upcoming_events[index] = event_id;
            events_registry.upcoming_event_count += 1;
        },
        EventStatus::Ongoing => {
            if events_registry.ongoing_event_count >= MAX_EVENTS_PER_CATEGORY as u64 {
                return err!(RegistryError::CategoryFull);
            }
            let index = events_registry.ongoing_event_count as usize;
            events_registry.ongoing_events[index] = event_id;
            events_registry.ongoing_event_count += 1;
        },
        EventStatus::Finished => {
            if events_registry.finished_event_count >= MAX_EVENTS_PER_CATEGORY as u64 {
                return err!(RegistryError::CategoryFull);
            }
            let index = events_registry.finished_event_count as usize;
            events_registry.finished_events[index] = event_id;
            events_registry.finished_event_count += 1;
        }
    }
    
    msg!("Event status updated to {:?}", new_status);
    Ok(())
}