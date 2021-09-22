import { useEffect, useState, useRef } from "react";
import {
  getCurrentWalletConnected, //import here
  mintNFT, connectWallet, getTxReceipt, getEthPrice, getContractPrice
} from "./utils/interact.js";
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Form from 'react-bootstrap/Form'
import ethLogo from './media/e.png'
import { getGasPrice } from "./utils/interact.js";
import Alert from 'react-bootstrap/Alert'
import { getContent } from './utils/cms';
import HTML2React from 'html2react'

const Mint = ({quantity}) => {
  const [qty, setQty] = useState(1);
  //State variables

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [cost, setCost] = useState(.005);
  const [price, setPrice] = useState(qty * cost);
  const [ethprice, setEthPrice] = useState(0);
  const [txProgress, setTxProgress] = useState(0);
  const [txStatus, setTxStatus] = useState("");
  const [txIntervalId, setTxIntervalId] = useState();
  const [txSuccessMsg, setTxSuccessMsg] = useState();

  const [isMetamask, setIsMetamask] = useState(true);
  const [isEthereum, setIsEthereum] = useState(false);
  const [gasPrice, setGasPrice] = useState(0);
  const [data, setData] = useState({Title: "Mint your Hilarious Huskies"})

  useEffect(async () => {
    setData(await getContent("website-sections/3"))
  
  },[0]);

  useEffect(async () => {
   

    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
    addWalletListener(); 
    isMetaMaskInstalled();
    ///setCost(getContractPrice())

    getEthPrice().then((data)=>{
      setEthPrice(parseFloat(data.result.ethusd));
    })

    getGasPrice().then(function(gasPriceData){
      try{
        setGasPrice(gasPriceData.result.ProposeGasPrice)
      }catch(e){
        console.log(e)
      }     
    });

}, []);

useEffect(async () => {

  txReceiptListener(); 

  
}, []);


const txReceiptListener = async () => {

  if(txProgress === 100){
    clearInterval(txIntervalId)
    setTxIntervalId(0)
  } 
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const isMetaMaskInstalled = async () => {

    if (window.ethereum){     
      setIsEthereum(window.ethereum.isMetaMask)
    }
  
  }

 function addWalletListener() {
    if (window.ethereum) {      
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);  
          setIsMetamask(true)        
          setStatus("👆🏽 Select quantity to mint.");
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

  const resetForm = (event) => { //TODO: implement
    event.preventDefault();
    window.location.reload();
    setQty(1)
    setTxProgress(0)
    setStatus("")
    clearInterval(txIntervalId)
    setTxIntervalId(0)

  }
  


  const onMintPressed = async (event) => { //TODO: implement
    event.preventDefault();

    setTxProgress(33)
    setTxStatus("Signing transaction...")
    const { status, txHash, success } = await mintNFT(qty);
    setStatus(status);
    
    ///check for successful transaction
      if(success ===true){
          setTxProgress(66)
          setTxStatus("awaiting tx receipt...")
            
            var delayInMilliseconds = 3000; //delay to check etherscan for tx receipt

      const newIntervalId = setInterval(function() {
        var txStatusMsg = "The following tokens have been minted to your wallet:"
            try{

              getTxReceipt(txHash).then((data)=>{
                try{

                  var txlogs = data.result.logs
    
                  txlogs.map((log)=>{
                    let logHex = log.topics[3]
                    let logInt = parseInt(logHex, 16);
                    txStatusMsg = txStatusMsg + ` HilariousHusky #${logInt} \n`
                  })
                  setTxProgress(100)
                  setTxStatus("minting complete")
                  setTxSuccessMsg(txStatusMsg);
                  clearInterval(txIntervalId)
                  setTxIntervalId(0)
                }catch(e){console.log(e)}
               
              })

            }catch(e){console.log(e)}
          }, delayInMilliseconds)

          setTxIntervalId(newIntervalId)

       
        }else{
          setTxProgress(0)
          setTxStatus("Something went wrong")
        }
    
  };


  const handleChange = event => {
    event.preventDefault()
    setQty(event.target.value);
    setPrice(event.target.value * cost)
  };

  function MintButtonLogic(props) {

    if(txProgress === 0)
    return (
      walletAddress && (<Button variant="dark" onClick={onMintPressed}>
      Mint
     </Button> ) 
        
    )
    if(txProgress === 100)
    return(
      <Button onClick={resetForm}>
         Reset
        </Button>
    )
    else
    return(
            
      <Button variant="dark" disabled>
       Processing...
    </Button>
    )
  }




  return (
  <>
      
      <h1 class="text-6xl md:text-6xl xl:text-9xl font-bold">{data.Title}</h1>

{isMetamask ? (
<>
<div class="lg:text-base xl:text-lg py-3 text">    
        {HTML2React(data.Body)}  
</div>

<div class="flex flex-wrap space-y-4 md:w-1/2 w-2/3 ">
  <span>Mint Quantity</span>
      <Form.Select value={qty}  onChange={handleChange} >
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
      <option value={20}>20</option>
      </Form.Select>

     <div class="flex flex-wrap font-medium"><img width={20} src={ethLogo} />{price} (approx ${(price*ethprice).toFixed(2)}) + Gas
     | Current Avg Gas: {gasPrice} GWEI
     </div>
 </div>   

<div class="py-2">
{txSuccessMsg && (
        <Alert variant="success">
        {txSuccessMsg}
      </Alert>
      
      )}
</div> 
        <div class="py-2">
        {status && (
          <Alert>
          <div class="break-word">{status}</div>
          </Alert>
        )}
        </div>

        <div class="py-2">
        <ProgressBar animated  now={txProgress} label={`${txProgress}% ${txStatus}`} />
        </div>

<MintButtonLogic />

</>
          ) : (<>
          
          In order to mint your husky NFT, connect to an Ethereum network wallet. 
         


          </>)}

        <div>
    </div>  
</>
  );
};

export default Mint;

