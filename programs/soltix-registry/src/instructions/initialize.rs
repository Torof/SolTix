use anchor_lang::prelude::*;
use crate::{state::*, errors::*};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + (32 * 50) + (32 * 100) + (32 * 100) + (32 * 100) + 1, // estimate space
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    let authority = &ctx.accounts.authority;
    
    registry.authority = authority.key();
    registry.organization_count = 0;
    registry.organizations = Vec::new();
    registry.upcoming_events = Vec::new();
    registry.ongoing_events = Vec::new();
    registry.finished_events = Vec::new();
    registry.bump = *ctx.bumps.get("registry").unwrap();
    
    msg!("Registry initialized with authority: {}", authority.key());
    Ok(())
}