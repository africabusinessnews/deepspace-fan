import React, { useState, Suspense, lazy, useEffect } from "react";
import Web3 from "web3";
//NOTE: UPDATE THIS JSON WHEN NEW DEPLOYMENT IS DONE
import {contract} from "./contract";
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


const Top = () => {

  
  const top25 = [`0xa468d9eaac45897163ada88d876ecf2b0ccdce7e`,
    `0x00000002eef9c6f61ff8df19afa782061ad35daf`,
    `0x09c5577fe587a772dcb44a15e3a4ddf43130e15b`,
    `0x5f68f28b9e313fce52b122d464431e94ecfdc887`,
    `0x12305067b014e850f3d2dc34ae9066b7f2504046`,
    `0xbd74c3f96c38478460a0e3c88ac86dd133af72be`,
    `0x52a337a2da1db041ebda3015c327732a85636d40`,
    `0x09c5577fe587a772dcb44a15e3a4ddf43130e15b`,
    `0x837895bce8048f53b6798be495b58a07205857df`,
    `0x198e363e2e7d58f521960e4175a7dfe0f59936f2`,
    `0x3dd4a2345401913e4ec44b23aaaf300669689c5b`,
    `0x0d1d74535bcabda2da2cff5a53c2b899901d423b`,
    `0x352904c253d23dfa60f826e31baf58b09de8f459`,
    `0xa4884829a03ca8ed70bbe1dab6e217c12b7ebd5e`,
    `0x061c594850b9fae25cb8f832cf24e69fb0cfe61c`,
    `0x352904c253d23dfa60f826e31baf58b09de8f459`,
    `0xe69aaab4c32313191788d12753f016880690ca3b`,
    `0x352904c253d23dfa60f826e31baf58b09de8f459`,
    `0x88906af7616f88f610d1e479325a5c5f93ba1e2c`,
    `0xccb6d1e4acec2373077cb4a6151b1506f873a1a5`,
    `0x34b5f399cc5a1dd491666c9866941fb8e8d09746`,
    `0x3b8b35d37abc65ccf7c78bd677241870417c8451`,
    `0xab47e1ce605580c42a1b1eca12831b17a18ea282`,
    `0xd0680be2393998a558c9864a0c264ac8731bd4df`,
    `0xac1d450752fcf428be4d81dc820751fed78ec44d`,
    ]

  const [collection, setCollection] = useState(false);
  const [collectionItems, setCollectionItems] = useState();
  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState();
  const [contractAddress, setContractAddress] = useState("0x1E4e1208Ab4BA7740FE73D3728DF1f89bE6C649b");
  const [space, setSpace] = useState();
  const [balance, setBalance] = useState("0");
  const [withdrawn, setWithdrawn] = useState("0");
  const [totalPlanetOwned, setTotalPlanetOwned] = useState(0);

  const [walletRefresh, setWalletRefresh] = useState(false);
  // walletRefreshNum is literally just here to force a collection refresh
  const [walletRefreshNum, setWalletRefreshNum] = useState(0);
  const [withdrawInProgress, setWithdrawInProgress] = useState(false);
  const [walletErr, setWalletErr] = useState();
  const [topResults, setTopResults] = useState([]);


 const connectWallet = async () => {
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

      const spaceInstance = new web3Instance.eth.Contract(
        contract.abi,
        contractAddress
      );
      setSpace(spaceInstance);

      //set default account 
      const accounts = await web3Instance.eth.getAccounts();

      //"0xa468d9eaac45897163ada88d876ecf2b0ccdce7e" //accounts[0]
      setWalletAddress(accounts[0]);


    //    let summary = spaceInstance.methods.userHighLevelSummary(add).call();
     //   let planet = spaceInstance.methods.userRockLevelSummary(add).call();

  };



  
  return (
    <>

<Button onClick={connectWallet} /> 

                <div className="wallet">


{walletErr && <p className="walleterror">{walletErr}</p>}
{!walletErr && walletAddress && (
  <div className="addressRow mb-5">
    <div className="wallet_address col-lg-10">
      <div className="col-lg-10 mx-auto px-3">
        
        <div className="addressHr"></div>
        <div className="d-flex justify-content-between align-items-center">
                <table>
                  <tbody>
                  
            
                  </tbody>
                
                </table>
                  
        </div>
      </div>
     
    </div>
  </div>
)}

</div>



   
    </>
  );
};

export default Top;
