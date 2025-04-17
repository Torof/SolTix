use anchor_lang::prelude::*;
use crate::{state::*, errors::*};

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"organization_data", owner.key().as_ref()],
        bump = organization_data.bump,
        constraint = organization_data.owner == owner.key() @ OrganizationError::Unauthorized
    )]
    pub organization_data: Account<'info, OrganizationData>,
}

pub fn handler(
    ctx: Context<UpdateMetadata>,
    name: Option<String>,
    metadata_uri: Option<String>,
) -> Result<()> {
    let org_data = &mut ctx.accounts.organization_data;
    
    // Update fields if provided
    if let Some(name) = name {
        if name.len() > 50 {
            return err!(OrganizationError::NameTooLong);
        }
        org_data.name = name;
    }
    
    if let Some(metadata_uri) = metadata_uri {
        if metadata_uri.len() > 200 {
            return err!(OrganizationError::UriTooLong);
        }
        org_data.metadata_uri = metadata_uri;
    }
    
    msg!("Organization metadata updated");
    Ok(())
}