use anchor_lang::prelude::*; //import anchor

declare_id!("o4RD8aU7TuiN7mEFJLhbCudeVFmt7Mpo2VWKB7zS8oi"); //program id

#[program] 
// #[porgram] are macros — and they basically attach code to our module. It's sorta like "inheriting" a class.
//module below is the program, create handlers to call these functions
// RPC request handlers that we will be able to call from a client application to interact with the program 
pub mod myepicproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
        // Get a reference to the account.
    let base_account = &mut ctx.accounts.base_account;
    // Initialize total_gifs.
    base_account.total_gifs = 0;
        Ok(())
    }

    // Another function woo!
    // The function now accepts a gif_link param from the user. We also reference the user from the Context
  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> ProgramResult {
    // Get a reference to the account and increment total_gifs.
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

     // Build the struct.
  let item = ItemStruct {
    gif_link: gif_link.to_string(),
    user_address: *user.to_account_info().key,
  };
  // Add it to the gif_list vector.
  base_account.gif_list.push(item);
  base_account.total_gifs += 1;
  Ok(())
}

  

}
  


 
  



// Attach certain variables to the StartStuffOff context.
//specify how to initialize the #[account] and what to hold in our StartStuffOff context
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)] //telling Solana how we want to initialize BaseAccount. which is the pub base_account?
    //'init'  will tell Solana to create a new account owned by our current program
    //'payer = user' tells our program who's paying for the account to be created. In this case, it's the user calling the function.
    //'space = 9000' which will allocate 9000 bytes of space for our account
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    //Signer<'info> is data passed into the program that proves to the program that the user calling this program actually owns their wallet account.
    pub system_program: Program <'info, System>,
    // a reference to the SystemProgram
}

// Specify what data you want in the AddGif Context.
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
  pub user: Signer<'info>,
  }

// Create a custom struct for us to work with.
//serialize our data into binary format before storing it,deserialize to retrieve it
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

// Tell Solana what we want to store on this account.
//tells our program what kinda of account it can make and what to hold inside of it
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}