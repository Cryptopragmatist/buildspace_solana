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
    votes: 0,
    voters: [].to_vec(),
  };
  // Add it to the gif_list vector.
  base_account.gif_list.push(item);
  base_account.total_gifs += 1;
  Ok(())
}
pub fn update_item(ctx: Context<UpdateItem>, gif_link: String) -> ProgramResult {
  let base_account = &mut ctx.accounts.base_account;
  let user = &mut ctx.accounts.user;
  
  let mut update = true;
  let mut index = 0;
  for (i, x) in base_account.gif_list.iter().enumerate() {
      if x.gif_link == gif_link {
          if x.voters.contains(&*user.to_account_info().key) {
              update = false;
          }
          index = i;
          
      };
  };
  
  if update {
      base_account.gif_list[index].votes += 1;
      base_account.gif_list[index].voters.push(*user.to_account_info().key);
  }
  
  Ok(())
}
pub fn send_tip(ctx: Context<SendTip>, amount: u64) -> ProgramResult {
  let from_account = &mut ctx.accounts.user;
  let to_account = &mut ctx.accounts.to;

  let ix = anchor_lang::solana_program::system_instruction::transfer(
      &from_account.key(),
      &to_account.key(),
      amount,
  );

  anchor_lang::solana_program::program::invoke(
      &ix,
      &[
          from_account.to_account_info(),
          to_account.to_account_info(),
      ]
  );
  
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

  #[derive(Accounts)]
  pub struct UpdateItem<'info> {
      #[account(mut)]
      pub base_account: Account<'info, BaseAccount>,
      #[account(mut)]
      pub user: Signer<'info>,
  }

  #[derive(Accounts)]
pub struct SendTip<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

// Create a custom struct for us to work with.
//serialize our data into binary format before storing it,deserialize to retrieve it
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub votes: u32,
    pub voters: Vec<Pubkey>,
}

// Tell Solana what we want to store on this account.
//tells our program what kinda of account it can make and what to hold inside of it
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}