use anchor_lang::prelude::*;

#[error_code]
pub enum EventError {
    #[msg("Only the authority can perform this action")]
    Unauthorized,
    
    #[msg("Ticket is already used")]
    TicketAlreadyUsed,
    
    #[msg("Event not found")]
    EventNotFound,
    
    #[msg("Event is sold out")]
    EventSoldOut,
    
    #[msg("Invalid ticket")]
    InvalidTicket,
}