use anchor_lang::prelude::*;

declare_id!("6MLxi26fU4wWDh33NvEuoA3aWbasv1vTpwbktdLk368k");

#[program]
pub mod soltix_event {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let event_manager = &mut ctx.accounts.event_manager;
        let authority = &ctx.accounts.authority;
        
        event_manager.authority = authority.key();
        event_manager.ticket_count = 0;
        event_manager.bump = ctx.bumps.event_manager;
        
        msg!("Event manager initialized");
        Ok(())
    }
    
    pub fn create_ticket(ctx: Context<CreateTicket>, event_id: Pubkey) -> Result<()> {
        let event_manager = &mut ctx.accounts.event_manager;
        let ticket = &mut ctx.accounts.ticket;
        let buyer = &ctx.accounts.buyer;
        
        // Create ticket data
        ticket.buyer = buyer.key();
        ticket.event = ctx.accounts.event.key();
        ticket.event_id = event_id;
        ticket.used = false;
        ticket.bump = ctx.bumps.ticket;
        
        // Increment ticket count
        event_manager.ticket_count += 1;
        
        msg!("Ticket created");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 1,
        seeds = [b"event_manager"],
        bump
    )]
    pub event_manager: Account<'info, EventManager>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(event_id: Pubkey)]
pub struct CreateTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"event_manager"],
        bump = event_manager.bump
    )]
    pub event_manager: Account<'info, EventManager>,
    
    /// CHECK: Foreign account from organization program
    pub event: UncheckedAccount<'info>,
    
    #[account(
        init,
        payer = buyer,
        space = 8 + 32 + 32 + 32 + 1 + 1,
        seeds = [b"ticket", event.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub ticket: Account<'info, Ticket>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct EventManager {
    pub authority: Pubkey,
    pub ticket_count: u64,
    pub bump: u8,
}

#[account]
pub struct Ticket {
    pub buyer: Pubkey,
    pub event: Pubkey,
    pub event_id: Pubkey,
    pub used: bool,
    pub bump: u8,
}