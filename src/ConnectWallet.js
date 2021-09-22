import { useEffect, useState, useRef } from "react";
import {
  getCurrentWalletConnected, //import here
  connectWallet, 
} from "./utils/interact.js";

import Button from 'react-bootstrap/Button'
const ConnectWallet = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [isMetamask, setIsMetamask] = useState(false);


  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
    addWalletListener(); 
    isMetaMaskInstalled();
}, []);



  
const connectWalletPressed = async () => {
  const walletResponse = await connectWallet();
  setStatus(walletResponse.status);
  setWallet(walletResponse.address);
};

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("");
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}

const isMetaMaskInstalled = async () => {

  if (window.ethereum){     
    setIsMetamask(window.ethereum.isMetaMask)
  }

}

 function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }




  return (
   
    <div>
    {isMetamask ? (

<Button variant="dark" onClick={connectWalletPressed}>
{walletAddress.length > 0 ? (
  "Connected: " +
  String(walletAddress).substring(0, 6) +
  "..." +
  String(walletAddress).substring(38)
) : (
  <span>Connect Wallet</span>
)}
</Button>

    ) : (

      <Button 
      variant="dark"
      onClick={(e) => {
        e.preventDefault();
        window.location.href='https://metamask.app.link/dapp/hilarioushuskies.life/';
        }}
  >Get Metamask</Button>

    ) }




</div>  

  );
};

export default ConnectWallet;

