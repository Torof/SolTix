use anchor_lang::prelude::*;

mod state;
mod instructions;
mod errors;

use instructions::*;
pub use state::*;
pub use errors::*;

declare_id("EpkzAK8Q6MsUcLqXxBoJeat5FDRoRWeHxvShHV7nAoF8");

#[program]
pub mod soltix_registry {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    pub fn register_organization(
        ctx: Context<RegisterOrganization>,
        name: String,
        description: String,
    ) -> Result<()> {
        instructions::register_organization::handler(ctx, name, description)
    }

    pub fn update_event_status(
        ctx: Context<UpdateEventStatus>,
        event_id: Pubkey,
        new_status: EventStatus,
    ) -> Result<()> {
        instructions::update_event_status::handler(ctx, event_id, new_status)
    }
}