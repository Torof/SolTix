use anchor_lang::prelude::*;
use crate::state::{Registry, OrganizationInfo, MAX_ORGANIZATIONS};
use crate::errors::RegistryError;

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
    pub registry: Account<'info, Registry>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 8 + 50 + 32 + 200 + 1 + 32 + 1, // estimate space
        seeds = [b"organization", registry.organization_count.to_le_bytes().as_ref()],
        bump
    )]
    pub organization_info: Account<'info, OrganizationInfo>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RegisterOrganization>,
    name: String,
    description: String,
) -> Result<()> {
    // Validate inputs
    if name.len() > 50 {
        return err!(RegistryError::NameTooLong);
    }
    if description.len() > 200 {
        return err!(RegistryError::DescriptionTooLong);
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
    org_info.bump = ctx.bumps.organization_info;
    
    // Add organization to registry - fix borrow checker issues by storing the index first
    if registry.organization_count_added < MAX_ORGANIZATIONS as u64 {
        let index = registry.organization_count_added as usize;
        registry.organizations[index] = org_info.key();
        registry.organization_count_added += 1;
        registry.organization_count += 1;
    } else {
        return err!(RegistryError::RegistryFull);
    }
    
    msg!("Organization registered: {}", org_info.name);
    Ok(())
}