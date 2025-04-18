use anchor_lang::prelude::*;

#[error_code]
pub enum EventError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    
    #[msg("Event has not started yet")]
    EventNotStarted,
    
    #[msg("Event has already ended")]
    EventEnded,
    
    #[msg("No tickets remaining")]
    SoldOut,
    
    #[msg("Payment amount is incorrect")]
    IncorrectPaymentAmount,
}