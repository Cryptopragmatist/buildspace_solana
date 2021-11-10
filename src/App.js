import { useEffect,useState  } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  /*Our function here is checking the window object in our DOM to see if the Phantom
   Wallet extension has injected the solana object. If we do have a solana object, we can also check to
  see if it's a Phantom Wallet.*/

  //State
  const [walletAddress, setWalletAddress] = useState(null);
  

 //actions
 //This function holds the logic for deciding if a Phantom Wallet is connected or not
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
  
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          //The solana object gives us a function that will allow us to connect directly with the user's wallet

          /*. As soon as someone goes to our app, we can check to see if they have Phantom Wallet installed or not.*/
          //the connect method will only run if the user has already authorized a connection to your app
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          //Set the user's publicKey in state to be used later

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const connectWallet = async () => {
    const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
  };
  //pop up ui for connecting user wallet to the app
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /*In React, the useEffect hook gets called once on component mount when that second parameter (the []) is empty.
  . As soon as someone goes to our app, we can check to see if they have Phantom Wallet installed or not.*/



  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};


export default App;
