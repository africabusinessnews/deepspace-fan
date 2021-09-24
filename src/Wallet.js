import React, { useState, Suspense, lazy, useEffect } from "react";
import Web3 from "web3";
//NOTE: UPDATE THIS JSON WHEN NEW DEPLOYMENT IS DONE
import {contract} from "./contract";
import {burnerabi} from "./burnerabi";
import Miner from "./Miner"
import MyCollection from "./MyCollection";
import Button from "react-bootstrap/Button";
import Intro from './Intro'
import { createBrowserHistory } from 'history';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Explore from './Explore'
import { Helmet } from 'react-helmet';
import banner from "./media/banner.jpg"
import NavComp from './Nav';    
import Verify from './Verify';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {getTokenData} from "./utils/interact"
import Top from "./Top";
import Burner from "./Burner"
const history = createBrowserHistory();

const Wallet = () => {


  const [collection, setCollection] = useState(false);
  const [collectionItems, setCollectionItems] = useState();
  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [space, setSpace] = useState();
  const [balance, setBalance] = useState("0");
  const [withdrawn, setWithdrawn] = useState("0");
  const [totalPlanetOwned, setTotalPlanetOwned] = useState(0);

  const [walletRefresh, setWalletRefresh] = useState(false);
  // walletRefreshNum is literally just here to force a collection refresh
  const [walletRefreshNum, setWalletRefreshNum] = useState(0);
  const [withdrawInProgress, setWithdrawInProgress] = useState(false);
  const [walletErr, setWalletErr] = useState();

    //burner details
    const [burner, setBurner] = useState();
    const [burnerContractAddress, setBurnerAddress] = useState();


  const refreshUserBank = async () => {
    setWalletRefresh(true);
    const accounts = await web3.eth.getAccounts();
    const summary = await space.methods
      .userHighLevelSummary(accounts[0])
      .call();
    setBalance(summary.amountOwed);
    setWithdrawn(summary.amountRewarded);

    const rockSummary = await space.methods
      .userRockLevelSummary(accounts[0])
      .call();
    setCollectionItems(rockSummary);
    setTotalPlanetOwned(rockSummary.length);

    setWalletRefreshNum(walletRefreshNum + 1);
    setWalletRefresh(false);
  };

  useEffect(() => {
    // TODO: contract address should be in an env
    setContractAddress("0x1E4e1208Ab4BA7740FE73D3728DF1f89bE6C649b");
    // TODO: update the burner address
    setBurnerAddress("0xD3D6d30A2f4676e90C62EE28aDa3B4211AE13Eb7");
  }, []);

  const connectWallet = async (event) => {
    // this causes the inital request to connect metamask wallet
    // set web3 instance
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch {
      setWalletErr("Install and connect to metamask");
      return;
    }
    setWalletErr(false);
    const web3Instance = new Web3(window.ethereum);
    setWeb3(web3Instance);

    const init = async () => {
      // set school contract
      const spaceInstance = new web3Instance.eth.Contract(
        contract.abi,
        contractAddress
      );
      setSpace(spaceInstance);

      //set default account
      const accounts = await web3Instance.eth.getAccounts();

      //"0xa468d9eaac45897163ada88d876ecf2b0ccdce7e" //accounts[0]
      setWalletAddress(accounts[0]);

      // set user bank details
      // NOTE: this is the same as the refreshUserBank but needs to be seperate
      // because space and accounts are undefined
      const summary = await spaceInstance.methods
        .userHighLevelSummary(accounts[0])
        .call();
      setBalance(summary.amountOwed);
      setWithdrawn(summary.amountRewarded);
      const rockSummary = await spaceInstance.methods
        .userRockLevelSummary(accounts[0])
        .call();
      setCollectionItems(rockSummary);
      setTotalPlanetOwned(rockSummary.length);

        // set up burner
        const burnerInstance = new web3Instance.eth.Contract(
          burnerabi.abi,
          burnerContractAddress
        );
        setBurner(burnerInstance);
    };


        
    

    if (process.env.NODE_ENV === "production") {
      const chainID = await web3Instance.eth.getChainId();
      console.log(chainID);
      if (chainID === 1) {
        init();
      } else {
        setWalletErr("Connect to mainnet");
      }
    } else {
      init();
    }

    // refresh the page on wallet change or connect
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
        setWalletAddress(accounts[0]);
        if (web3) {
          refreshUserBank();
        }
      });
    }
  };

  const withdrawEth = async () => {
    setWithdrawInProgress(true);
    if (balance > 0) {
      try {
        const accounts = await web3.eth.getAccounts();
        await space.methods.payUser().send({ from: accounts[0] });
      } catch (err) {
        console.log(err);
      }
      await refreshUserBank();
    }
    setWithdrawInProgress(false);
  };

  

  return (
    <>

<Router history={history}>
      <div class="container mx-auto">             

 <Navbar collapseOnSelect expand="md">
  <Navbar.Brand href="/">
     Deep Space [Explorer]
    </Navbar.Brand>
 <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav>
      <Nav.Link href="/explore/">Explore</Nav.Link>
      <Nav.Link href="/provenance/">Provenance</Nav.Link>
      <Nav.Link href="/verify/">Verify</Nav.Link>
      <Nav.Link href="/collection/">My Collection</Nav.Link>
      <Nav.Link href="#">
          <Button variant="dark" className="connect" onClick={connectWallet}>
            Connect Wallet
          </Button>
       </Nav.Link>

      
    </Nav>
  </Navbar.Collapse>

</Navbar>

              <Switch>
                <Route path="/explore">
                <Explore />
                </Route>
                <Route path="/verify">
                <Verify />
                </Route>
                <Route path="/top">
                <Top />
                </Route>
                <Route path="/collection">
               
                    <MyCollection
                      collection={collectionItems}
                      web3={web3}
                      space={space}
                      walletRefreshNum={walletRefreshNum}
                      contractAddress={contractAddress}
                    />
         
                </Route>
                <Route path="/">


                <div className="wallet">


{walletErr && <p className="walleterror">{walletErr}</p>}
{!walletErr && walletAddress && (
  <div className="addressRow mb-5">
    <div className="wallet_address col-lg-10">
      <div className="col-lg-10 mx-auto px-3">
        <div className="address_details">
             <div className="d-flex justify-content-between align-items-center flex-wrap">
            <p>Wallet Address</p>
            <h6 className="walletAddress">{walletAddress}</h6>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p>TOTAL NUMBER OF PLANETS OWNED</p>
            <h6>{totalPlanetOwned}</h6>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p>YOUR ETH OWED</p>
            <h6>
              {web3
                ? `${web3.utils.fromWei(balance + "", "ether")}`
                : "0.00"}
            </h6>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p>YOUR TOTAL ETH WITHDRAWED</p>
            <h6>
              {web3
                ? `${web3.utils.fromWei(withdrawn + "", "ether")}`
                : "0.00"}
            </h6>
          </div>
        </div>
        <div className="addressHr"></div>
        <div className="d-flex justify-content-between align-items-center">
          <Button
            className={`connect ${walletRefresh ? "walletrefresh" : ""}`}
            onClick={refreshUserBank}
          >
            {/* Refresh wallet */}
            {walletRefresh ? "Refreshing Wallet..." : "Refresh wallet"}
          </Button>
          <Button
            className={`connect ${withdrawInProgress ? "withdraw" : ""}`}
            onClick={withdrawEth}
            disabled={withdrawInProgress}
          >
            {/* withdraw eth */}
            {withdrawInProgress ? "withdrawing" : "withdraw eth"}
          </Button>
        </div>
      </div>
     
    </div>
  </div>
)}
{!walletErr && walletAddress && (
  <Suspense fallback={<div></div>}>
    <Miner web3={web3} space={space} />
    <Burner
            web3={web3}
            space={space}
            burner={burner}
            burnerContractAddress={burnerContractAddress}
          />

  </Suspense>
)}



</div>
<Intro />

              
                </Route>
              
              
              </Switch>
          
      </div>
      </Router>


   
    </>
  );
};

export default Wallet;
