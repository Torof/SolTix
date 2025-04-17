use anchor_lang::prelude::*;

mod state;
mod instructions;
mod errors;

use instructions::*;
pub use state::*;
pub use errors::*;

declare_id!("FckJnm69ZRMy84E6PGxzb8b1vBa9WMRw4E8EsjkJifr");

#[program]
pub mod soltix_organization {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, metadata_uri: String) -> Result<()> {
        instructions::initialize::handler(ctx, name, metadata_uri)
    }

    pub fn update_metadata(
        ctx: Context<UpdateMetadata>,
        name: Option<String>,
        metadata_uri: Option<String>,
    ) -> Result<()> {
        instructions::update_metadata::handler(ctx, name, metadata_uri)
    }

    pub fn create_event(
        ctx: Context<CreateEvent>,
        name: String,
        metadata_uri: String,
        start_time: i64,
        end_time: i64,
        total_tickets: u64,
        ticket_price: u64,
    ) -> Result<()> {
        instructions::create_event::handler(
            ctx, 
            name, 
            metadata_uri,
            start_time, 
            end_time, 
            total_tickets, 
            ticket_price,
        )
    }
}