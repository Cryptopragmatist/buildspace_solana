const anchor = require('@project-serum/anchor');

// Need the system program
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")


  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  //Create and set the provider
  //Anchor to set our provider
  //it gets this data from solana config get, grabbing local environment
  //This way Anchor knows to run our code locally

  const program = anchor.workspace.Myepicproject;
  //automatically compile our code in lib.rs and get it deployed locally on a local validator
  /*Note: Naming + folder structure is mega important here. 
  Ex. Anchor knows to look at programs/myepicproject/src/lib.rs b/c we used anchor.workspace.Myepicproject*/

  
  const baseAccount = anchor.web3.Keypair.generate();
  // Create an account keypair for our program to use.
  // create some credentials for the BaseAccount we're creating


  
  // call our function 
  //'await' it which will wait for our local validator to "mine" the instruction.
  // Call start_stuff_off, pass it the parameters it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  /*Note: notice also that in lib.rs the function is called start_stuff_off since in Rust we use _ vs camel case.
   But, over in our javascript file we use camel case and actually call startStuffOff. 
   This is something nice Anchor does for us so we can follow best practices regardless of what language we're using.
    You can use underscores in Rust-land and camel case in JS-land.*/



  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Call add_gif!
  //pass gif link to function, pass in the user submitting the gif
  await program.rpc.addGif("insert_a_giphy_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  // call the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList)
}





const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain(); // run asynchronously