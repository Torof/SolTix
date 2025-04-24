use anchor_lang::prelude::*;

#[error_code]
pub enum OrganizationError {
    #[msg("Only the organization owner can perform this action")]
    Unauthorized,
    
    #[msg("Event is already sold out")]
    EventSoldOut,
    
    #[msg("Invalid event date")]
    InvalidEventDate,
    
    #[msg("Invalid price")]
    InvalidPrice,
    
    #[msg("Invalid capacity")]
    InvalidCapacity,
}