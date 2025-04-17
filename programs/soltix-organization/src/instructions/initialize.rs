use anchor_lang::prelude::*;
use crate::{state::*, errors::*};

#[derive(Accounts)]
#[instruction(name: String, metadata_uri: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 50 + 32 + 200 + 8 + (32 * 100) + 32 + 1, // estimate space
        seeds = [b"organization_data", owner.key().as_ref()],
        bump
    )]
    pub organization_data: Account<'info, OrganizationData>,
    
    /// CHECK: This is the registry program PDA
    pub registry: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<Initialize>,
    name: String,
    metadata_uri: String,
) -> Result<()> {
    // Validate inputs
    if name.len() > 50 {
        return err!(OrganizationError::NameTooLong);
    }
    if metadata_uri.len() > 200 {
        return err!(OrganizationError::UriTooLong);
    }
    
    let org_data = &mut ctx.accounts.organization_data;
    let owner = &ctx.accounts.owner;
    let registry = &ctx.accounts.registry;
    
    // Initialize organization data
    org_data.name = name;
    org_data.owner = owner.key();
    org_data.metadata_uri = metadata_uri;
    org_data.event_count = 0;
    org_data.events = Vec::new();
    org_data.registry = registry.key();
    org_data.bump = *ctx.bumps.get("organization_data").unwrap();
    
    msg!("Organization initialized: {}", org_data.name);
    Ok(())
}