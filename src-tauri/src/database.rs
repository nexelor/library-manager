use std::path::PathBuf;
use rusqlite::Connection;

use crate::error::AppError;

pub struct DatabaseInstance {
    url: PathBuf,
    cnx: Option<Connection>,
}

impl DatabaseInstance {
    pub async fn new() -> Result<Self, AppError> {
        Ok(Self {
            url: PathBuf::new(),
            cnx: None
        })
    }

    
}