use anchor_lang::prelude::*;

#[error_code]
pub enum RegistryError {
    #[msg("Organization name too long, maximum 50 characters")]
    NameTooLong,
    
    #[msg("Organization description too long, maximum 200 characters")]
    DescriptionTooLong,
    
    #[msg("Event not found")]
    EventNotFound,
    
    #[msg("Organization not found")]
    OrganizationNotFound,
    
    #[msg("Only the registry authority can perform this action")]
    Unauthorized,
    
    #[msg("Invalid event status transition")]
    InvalidStatusTransition,
    
    #[msg("Category has reached maximum capacity")]
    CategoryFull,
    
    #[msg("Registry has reached maximum capacity for organizations")]
    RegistryFull,
}