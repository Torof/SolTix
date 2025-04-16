use anchor_lang::prelude::*;

#[error_code]
pub enum RegistryError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    
    #[msg("Organization name is too long (max 50 characters)")]
    NameTooLong,
    
    #[msg("Organization description is too long (max 200 characters)")]
    DescriptionTooLong,
    
    #[msg("Event not found in any status list")]
    EventNotFound,
}