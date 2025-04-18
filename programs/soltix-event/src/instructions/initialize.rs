use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instructions::CreateMetadataAccountV3;
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
pub struct Initialize<'info> {
    #[account(mut)]
    pub organization: Signer<'info>,
    
    #[account(
        init,
        payer = organization,
        space = 8 + 50 + 32 + 200 + 8 + 8 + 8 + 8 + 8 + 32 + 1, // estimate space
        seeds = [b"event_data", organization.key().as_ref()],
        bump
    )]
    pub event_data: Account<'info, EventData>,
    
    // Collection mint for NFT tickets
    #[account(
        init,
        payer = organization,
        mint::decimals = 0,
        mint::authority = organization,
    )]
    pub collection_mint: Account<'info, Mint>,
    
    /// CHECK: This account is checked in the instruction
    #[account(mut)]
    pub collection_metadata: UncheckedAccount<'info>,
    
    /// CHECK: This account is checked in the instruction
    pub token_metadata_program: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<Initialize>,
    name: String,
    metadata_uri: String,
    start_time: i64,
    end_time: i64,
    total_tickets: u64,
    ticket_price: u64,
) -> Result<()> {
    let event_data = &mut ctx.accounts.event_data;
    let organization = &ctx.accounts.organization;
    
    // Initialize event data
    event_data.name = name.clone();
    event_data.organization = organization.key();
    event_data.metadata_uri = metadata_uri.clone();
    event_data.start_time = start_time;
    event_data.end_time = end_time;
    event_data.total_tickets = total_tickets;
    event_data.remaining_tickets = total_tickets;
    event_data.ticket_price = ticket_price;
    event_data.tickets_minted = 0;
    event_data.collection_mint = ctx.accounts.collection_mint.key();
    event_data.bump = *ctx.bumps.get("event_data").unwrap();
    
    // Create collection metadata
    let collection_name = format!("{} Tickets", name);
    let collection_symbol = "TICKET";
    
    // Create metadata for the collection
    let create_metadata_ix = CreateMetadataAccountV3 {
        metadata: ctx.accounts.collection_metadata.key(),
        mint: ctx.accounts.collection_mint.key(),
        mint_authority: organization.key(),
        payer: organization.key(),
        update_authority: organization.key(),
        system_program: ctx.accounts.system_program.key(),
        rent: ctx.accounts.rent.key(),
    };
    
    // Set collection metadata
    let collection_data = mpl_token_metadata::types::DataV2 {
        name: collection_name,
        symbol: collection_symbol.to_string(),
        uri: metadata_uri,
        seller_fee_basis_points: 0,
        creators: Some(vec![
            mpl_token_metadata::types::Creator {
                address: organization.key(),
                verified: true,
                share: 100,
            }
        ]),
        collection: None,
        uses: None,
    };
    
    // Create the collection metadata
    create_metadata_ix.create_metadata_account_v3(
        collection_data,
        true,
        true,
        Some(mpl_token_metadata::types::CollectionDetails::V1 { size: 0 }),
    )?;
    
    msg!("Event initialized: {}", event_data.name);
    Ok(())
}