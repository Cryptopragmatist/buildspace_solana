use anchor_lang::prelude::*; //import anchor

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); //program id

#[program] 
// #[porgram] are macros — and they basically attach code to our module. It's sorta like "inheriting" a class.
//module below is the program, create handlers to call these functions
// RPC request handlers that we will be able to call from a client application to interact with the program 
pub mod myepicproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StartStuffOff {}
