import { useEffect,useState  } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'cryptopragmatic';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
	'http://www.reactiongifs.com/r/stomer.gif',
	'https://c.tenor.com/yTxA7WgkBEUAAAAd/grandpa-abe-exit.gif',
	'https://c.tenor.com/z0xK794tF-kAAAAd/yelling-cloud.gif',
	'http://www.reactiongifs.com/r/2012/06/homer_lurking.gif',
  'https://c.tenor.com/IDJmsg3UIA4AAAAC/homer-day-dreaming.gif',
  'https://c.tenor.com/Er8GuCI8O_QAAAAC/the-simpsons-excellent.gif'
]

const App = () => {

  /*Our function here is checking the window object in our DOM to see if the Phantom
   Wallet extension has injected the solana object. If we do have a solana object, we can also check to
  see if it's a Phantom Wallet.*/

  //State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);
  

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
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
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


//creating a new function called renderConnectedContainer ,simple UI code that will map through all our GIF links and render them
  const renderConnectedContainer = () => (
    <div className="connected-container">
      {/* Go ahead and add this input and button to start */}
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}
    >
      <input type="text" placeholder="Enter simpsons only gif link!" 
      value={inputValue} onChange={onInputChange}  />
      <button type="submit" className="cta-button submit-gif-button">Submit it, darn it</button>
    </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}

        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
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

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      
      // Call Solana program here.
  
      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 SIMPSON VILLAGE</p>
          <p className="sub-text">
            View your Simpson GIF collection in the metaverse ✨ SIMPSONS!
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* We just need to add the inverse here! */}
        {walletAddress && renderConnectedContainer()}
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
