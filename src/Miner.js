import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from 'react-bootstrap/Button'
//656s
const Miner = (props) => {
  const [mintCost, setMintCost] = useState("0");
  const [currentTokenId, setCurrentTokenId] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [wNonce, setWNonce] = useState(0);
  const [currentBlockNum, setCurrentBlockNum] = useState();
  const [mineInProgress, setMineInProgress] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [previousHash, setPreviousHash] = useState();
  const [currentHash, setCurrentHash] = useState();
  const [currentIndex, setCurrentIndex] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [showMsg, setMsg] = useState();

  const updateMintDetails = async () => {
    const blockNum = await props.web3.eth.getBlockNumber();
    setCurrentBlockNum(blockNum);

    const powDetails = await props.space.methods.powDetails().call();
    setMintCost(powDetails.mintCost);
    setPreviousHash(powDetails.previousHash)

    const token = await props.space.methods.currentTokenId().call();
    setCurrentTokenId(token);

    const totalPlanets = await props.space.methods.totalSupply().call();
    setTotalTokens(totalPlanets);

  };

  useEffect(() => {
    updateMintDetails();

    // event handler for new mints, so update mint details if necessary
    const sub = props.space.events.Transfer(
      {
        filter: {
          _from: "0x0000000000000000000000000000000000000000",
        },
        fromBlock: "latest",
      },
      async (error, event) => {
        updateMintDetails();
      }
    );

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const chechproof = async (nonceIndex, account) => {
    let result
    setCurrentIndex(nonceIndex)
    
      try {
        result = await props.space.methods.verifyProofOfWork(account, nonceIndex).call()
        setCurrentHash(result[1])
        if(result[0] === true)
        {
          setWNonce(nonceIndex)
          setMineInProgress(false)
          tryMint()
          console.log("FOUND IT!", nonceIndex, result)
        }
      //  console.log(nonceIndex,result)

      }catch(e){console.log(e)}

      return(result[0]) 
  }

  useEffect(() => {
    const mine = async () => {
      if (mineInProgress) {
        try {
      
          const accounts = await props.web3.eth.getAccounts();
         
          await Promise.all(

            Array.from({ length: 5000 }).map((_, index) => (
              chechproof((nonce * 5000) + index, accounts[0])
            ))
            
            )

          let powHashFound = false
          
          if (!powHashFound) {
            setNonce(nonce + 1);
            return;
          } else {
            console.log("Start Audio")
          }
        } catch (error) {
          setNonce(nonce + 1);
          console.log("Error while mining: " + error.message);
        }
      }
    };
    mine();
   
    

  }, [mineInProgress, nonce]);

  function startMining() {
    setMsg();
    setMineInProgress(true);
  }

  function pauseMining() {
    setMineInProgress(false);
  }

  const tryMint = async () => {
    setMintLoading(true);
    const accounts = await props.web3.eth.getAccounts();
    try {
      await props.space.methods
        .mintTo(accounts[0], wNonce)
        .send({ from: accounts[0], value: mintCost });
      setMsg("Mint Successful!");
    } catch (err) {
      console.log(err.message);
      setMsg("Uh oh! Someone has already explored that planet 😕");
    }
    setMintLoading(false);
    setMineInProgress(false);
    setNonce(0);
  };

  return (
    <div className="miner">      
      <div className="addressRow">
        <div className="wallet_address col-lg-10">
          <div className="col-lg-10 mx-auto px-3">
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Total planets mined</p>
                <h6>{currentTokenId}</h6>
              </div>
              {totalTokens}
              <div className="d-flex justify-content-between align-items-center">
                <p>Current Block Number</p>
                <h6>{currentBlockNum}</h6>
              </div>

              
              <div className="d-flex justify-content-between align-items-center">
                <p>Current mint cost</p>
                <h6>{`${props.web3.utils.fromWei(mintCost, "ether")}`}</h6>
              </div>
            </div>
            <div className="addressHr"></div>
            <div class="flex flex-wrap space-x-2">
              <Button onClick={startMining}>Start</Button>
              <Button onClick={pauseMining}>Stop</Button>
              <Button                
                onClick={tryMint}
                disabled={mintLoading}
              >
                {mintLoading ? "Minting  " : "Mint"}
                {mintLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                  />
                )}
              </Button>
            </div>
            <div className="addressHr mt-4"></div>
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Nonce Index</p>
                <h6 className="count">{nonce}</h6>
              </div>
            </div>
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Previous Hash</p>
                <h6 className="count">{previousHash}</h6>
              </div>
            </div>
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Current Index</p>
                <h6 className="count">{currentIndex}</h6>
              </div>
            </div>
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Current Hash</p>
                <h6 className="count">{currentHash}</h6>
              </div>
            </div>
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Winner Nonce</p>
                <h6 className="count">{wNonce}</h6>
              </div>
            </div>
            {showMsg && (
              <div>
                <div className="addressHr mt-4"></div>
                <div className="address_details">
                  <p style={{ textAlign: "center" }}>{showMsg}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Miner;
