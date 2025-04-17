use anchor_lang::prelude::*;

#[error_code]
pub enum OrganizationError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    
    #[msg("Name is too long (max 50 characters)")]
    NameTooLong,
    
    #[msg("URI is too long (max 200 characters)")]
    UriTooLong,
    
    #[msg("End time must be after start time")]
    InvalidTimeRange,
}