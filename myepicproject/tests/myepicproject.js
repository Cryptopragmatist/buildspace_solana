const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log("🚀 Starting test...")

  anchor.setProvider(anchor.Provider.env());
  //Anchor to set our provider
  //it gets this data from solana config get, grabbing local environment
  //This way Anchor knows to run our code locally
  const program = anchor.workspace.Myepicproject;
  //automatically compile our code in lib.rs and get it deployed locally on a local validator
  /*Note: Naming + folder structure is mega important here. 
  Ex. Anchor knows to look at programs/myepicproject/src/lib.rs b/c we used anchor.workspace.Myepicproject*/
  const tx = await program.rpc.startStuffOff();
  // call our function 
  //'await' it which will wait for our local validator to "mine" the instruction.

  console.log("📝 Your transaction signature", tx);
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