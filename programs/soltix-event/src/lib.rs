use anchor_lang::prelude::*;

mod state;
mod instructions;
mod errors;

use instructions::*;
pub use state::*;
pub use errors::*;

declare_id!("6MLxi26fU4wWDh33NvEuoA3aWbasv1vTpwbktdLk368k");

#[program]
pub mod soltix_event {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        name: String, 
        metadata_uri: String,
        start_time: i64,
        end_time: i64,
        total_tickets: u64,
        ticket_price: u64,
    ) -> Result<()> {
        instructions::initialize::handler(
            ctx, 
            name, 
            metadata_uri,
            start_time, 
            end_time, 
            total_tickets, 
            ticket_price,
        )
    }

    pub fn mint_ticket(ctx: Context<MintTicket>) -> Result<()> {
        instructions::mint_ticket::handler(ctx)
    }
}