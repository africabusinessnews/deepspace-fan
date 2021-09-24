
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;

///Alchemy and web3
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contract = require('../contract')
const nftContract = new web3.eth.Contract(contract.contract.abi, contractAddress);
const ethWallet = "0xA571C095f241e4E24a8e09b95E1b667a8eDa70c2"
///console.log(nftContract.methods.getPrice.encodeABI())
///etherscan
const etherscanKey = process.env.REACT_APP_ETHERSCAN_KEY;
var api = require('etherscan-api').init(etherscanKey);


export async function getContractPrice(){
  const res = await nftContract.methods.getPrice().call();
  return res
}


export const getContractAddress = () => {
  return(contractAddress)
  }

export const getTokenSupply = async () => {
var supply = api.stats.tokensupply(null, contractAddress);
return(supply)
}

export const getEthPrice = async () => {
  var price = api.stats.ethprice();
  return(price)
}

export const getGasPrice = async () => {
  const gasApi = fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${etherscanKey}`, {method: "GET"})
  const response = (await gasApi).json()
  return(response)
}


export const getTokenData = async () => {
  const gasApi = fetch(`https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${contractAddress}&apikey=${etherscanKey}`, {method: "GET"})
  const response = (await gasApi).json()

  return(response)
}



export const getTxReceipt = async (txHash) => {
  var ret = api.proxy.eth_getTransactionReceipt(txHash); 
  return(ret)
}

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "Wallet connected...",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.app.link/dapp/hilarioushuskies.life/`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.app.link/dapp/hilarioushuskies.life/`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  
export const mintNFT = async(tokenCount) => {
    
    const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); //get latest nonce
    const price = 5000000000000000 ///.005 ETH - you could probably use Web3 to get this from the contract
    let txTotal = tokenCount * price
    const hexString = txTotal.toString(16);

    //the transaction
    const tx = {
      'from': window.ethereum.selectedAddress,
      'to': contractAddress,
      'nonce': nonce.toString(),
      'value': hexString,
      'data': nftContract.methods.mintTo(ethWallet, nonce).encodeABI()
    };
  
   
    //sign the transaction via Metamask
 try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [tx],
        })
        
    
        
    return {
        success: true,
        status: (<>✅ Check out your transaction on <a href={`https://etherscan.io/tx/${txHash}`}>Etherscan</a> </>),
        txHash: txHash
        

    }
 } catch (error) {
    return {
        success: false,
        status: "😥 Something went wrong: " + error.message + " Try reloading the page..."
    }

 }

  }
  
