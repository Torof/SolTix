use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instructions::{CreateMetadataAccountV3, CreateMasterEditionV3};
use crate::{state::*, errors::*};

#[derive(Accounts)]
pub struct MintTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(mut)]
    pub organization: SystemAccount<'info>,
    
    #[account(
        mut,
        seeds = [b"event_data", organization.key().as_ref()],
        bump = event_data.bump,
        constraint = event_data.remaining_tickets > 0 @ EventError::SoldOut,
    )]
    pub event_data: Account<'info, EventData>,
    
    // Mint for the new ticket NFT
    #[account(
        init,
        payer = buyer,
        mint::decimals = 0,
        mint::authority = buyer,
    )]
    pub ticket_mint: Account<'info, Mint>,
    
    // Buyer's token account to receive the NFT
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = ticket_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This account is checked in the instruction
    #[account(mut)]
    pub ticket_metadata: UncheckedAccount<'info>,
    
    /// CHECK: This account is checked in the instruction
    #[account(mut)]
    pub ticket_master_edition: UncheckedAccount<'info>,
    
    /// CHECK: Collection mint from event_data
    pub collection_mint: UncheckedAccount<'info>,
    
    /// CHECK: This account is checked in the instruction
    pub token_metadata_program: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    
    // Clock for time-based validation
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<MintTicket>) -> Result<()> {
    let event_data = &mut ctx.accounts.event_data;
    let buyer = &ctx.accounts.buyer;
    let organization = &ctx.accounts.organization;
    let clock = &ctx.accounts.clock;
    
    // Check if event is active
    let current_time = clock.unix_timestamp;
    if current_time < event_data.start_time {
        return err!(EventError::EventNotStarted);
    }
    if current_time > event_data.end_time {
        return err!(EventError::EventEnded);
    }
    
    // Increment ticket counter and decrement remaining tickets
    event_data.tickets_minted += 1;
    event_data.remaining_tickets -= 1;
    
    // Transfer payment to organization
    let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
        &buyer.key(),
        &organization.key(),
        event_data.ticket_price,
    );
    
    anchor_lang::solana_program::program::invoke(
        &transfer_instruction,
        &[
            buyer.to_account_info(),
            organization.to_account_info(),
        ],
    )?;
    
    // Create ticket metadata
    let ticket_number = event_data.tickets_minted;
    let ticket_name = format!("{} - Ticket #{}", event_data.name, ticket_number);
    let ticket_symbol = "TIX";
    
    // Create metadata for the NFT ticket
    let ticket_uri = format!("{}/{}", event_data.metadata_uri, ticket_number);
    
    // Create metadata account for ticket
    let create_metadata_ix = CreateMetadataAccountV3 {
        metadata: ctx.accounts.ticket_metadata.key(),
        mint: ctx.accounts.ticket_mint.key(),
        mint_authority: buyer.key(),
        payer: buyer.key(),
        update_authority: buyer.key(),
        system_program: ctx.accounts.system_program.key(),
        rent: ctx.accounts.rent.key(),
    };
    
    // Set ticket metadata
    let ticket_data = mpl_token_metadata::types::DataV2 {
        name: ticket_name,
        symbol: ticket_symbol.to_string(),
        uri: ticket_uri,
        seller_fee_basis_points: 0,
        creators: Some(vec![
            mpl_token_metadata::types::Creator {
                address: organization.key(),
                verified: false,
                share: 0,
            },
            mpl_token_metadata::types::Creator {
                address: buyer.key(),
                verified: true,
                share: 100,
            }
        ]),
        collection: Some(mpl_token_metadata::types::Collection {
            verified: false,
            key: ctx.accounts.collection_mint.key(),
        }),
        uses: None,
    };
    
    // Create the metadata account
    create_metadata_ix.create_metadata_account_v3(
        ticket_data,
        true,
        true,
        None,
    )?;
    
    // Create master edition for NFT
    let create_master_edition_ix = CreateMasterEditionV3 {
        edition: ctx.accounts.ticket_master_edition.key(),
        mint: ctx.accounts.ticket_mint.key(),
        update_authority: buyer.key(),
        mint_authority: buyer.key(),
        payer: buyer.key(),
        metadata: ctx.accounts.ticket_metadata.key(),
        token_program: ctx.accounts.token_program.key(),
        system_program: ctx.accounts.system_program.key(),
        rent: ctx.accounts.rent.key(),
    };
    
    // Set max supply to 1 for a true NFT
    create_master_edition_ix.create_master_edition_v3(
        Some(1),
    )?;
    
    msg!("Ticket #{} minted for event: {}", ticket_number, event_data.name);
    Ok(())
}