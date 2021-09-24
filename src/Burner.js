import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";

const Miner = (props) => {
  const [burnCost, setBurnCost] = useState("0");
  const [nonce, setNonce] = useState(0);
  const [showMsg, setMsg] = useState();
  const [planet1, setPlanet1] = useState("");
  const [planet2, setPlanet2] = useState("");
  const [disableSupernova, setDisableSupernova] = useState(true);
  const [disableApprove, setDisableApprove] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [burnInProgress, setBurnInProgress] = useState(false);
  const [burnLoading, setBurnLoading] = useState(false);
  const [wNonce, setWNonce] = useState(0);
  const [currentHash, setCurrentHash] = useState();
  const [currentIndex, setCurrentIndex] = useState(false);
  const chechproof = async (nonceIndex, account) => {
    let result
    setCurrentIndex(nonceIndex)
    
      try {
        result = await props.burner.methods.verifyBurnProofOfWork(account, nonceIndex).call()
        setCurrentHash(result[1])
        if(result[0] === true)
        {
          console.log(result)
          setWNonce(nonceIndex)
          setBurnInProgress(false)
          tryBurn()
          console.log("FOUND IT!", nonceIndex, result)
        }
      //  console.log(nonceIndex,result)

      }catch(e){console.log(e)}

      return(result[0]) 
  }

  useEffect(() => {
    const burn = async () => {
      if (burnInProgress) {
        try {
          const accounts = await props.web3.eth.getAccounts();

          await Promise.all(

            Array.from({ length: 1000 }).map((_, index) => (
              chechproof((nonce * 1000) + index, accounts[0])
            ))
            
            )

          let powHashFound = false
          if (!powHashFound) {
            setNonce(nonce + 1);
            return;
          } else {

          }
        } catch (error) {
          setNonce(nonce + 1);
        }
      }
    };
    burn();
  }, [burnInProgress, nonce]);

  const tryBurn = async () => {
    setBurnLoading(true);
    const accounts = await props.web3.eth.getAccounts();
    try {
      await props.burner.methods
        .combineAndBurnAndMint(Number(planet1), Number(planet2), -1, wNonce)
        // todo: make extraplent -1
        // .combineAndBurnAndMint(planet1, planet2, -1, nonce)
        .send({ from: accounts[0], value: burnCost });
      setMsg("Collision Successful!");
    } catch (err) {
      setMsg("Uh oh! Someone beat you to it 😕");
    }
    setBurnLoading(false);
    setBurnInProgress(false);
    setNonce(0);

    setDisableApprove(false);
    setApproveLoading(false);

    setDisableSupernova(true);

  };

  function startBurning() {
    setMsg();

    setBurnInProgress(true);

  }

  const approveSupernova = async (event) => {
    setApproveLoading(true);
    // check for empty string


    // check if tokenIds are different

    const accounts = await props.web3.eth.getAccounts();




    // approve logic
    let approved = false;
    // check if already approved
    try {
      approved = await props.space.methods
        .isApprovedForAll(accounts[0], props.burnerContractAddress)
        .call();
    } catch (err) {
      setMsg("Something went wrong");
      setApproveLoading(false);
      return;
    }

    // if not already approve, approve
    if (!approved) {
      try {
        await props.space.methods
          .setApprovalForAll(props.burnerContractAddress, true)
          .send({ from: accounts[0] });
      } catch (err) {
        setMsg("Something went wrong");
        setApproveLoading(false);
        return;
      }
    }

    setDisableApprove(true);
    setApproveLoading(false);
    setDisableSupernova(false);
    setMsg("Collision has been approved! You can start collision now 💥");
  };

  return (
    <div>
      <div className="miner">

        <div className="addressRow">
          <div className="wallet_address col-lg-10">
            <div className="col-lg-10 mx-auto px-3">
              <div className="address_details">
                <p
                  className="center-box"
                  style={{ fontWeight: "bold", paddingBottom: ".5rem" }}
                >
                  Input 2 planets of the same type and Approve Collision
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <p>Input First Planet for collision</p>
                  <input className="border-2"
                    
                    
                    onInput={(e) =>
                      setPlanet1(e.target.value.replace(/\D/, ""))
                    }
                    value={planet1}
                  ></input>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p>Input Second Planet for collision</p>
                  <input className="border-2"
                    
                    onInput={(e) =>
                      setPlanet2(e.target.value.replace(/\D/, ""))
                    }
                    value={planet2}
                  ></input>
                </div>
              </div>
              <div className="addressHr"></div>
              <div className="addressBtnGroup">
                <Button
                 
                  disabled={approveLoading || disableApprove}
                  onClick={approveSupernova}
                >
                  Approve Collision
                  {approveLoading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </Button>

                <Button
                
                  disabled={disableSupernova}
                  onClick={startBurning}
                >
                  Start Collision
                </Button>
               
                <Button
                 
                  onClick={tryBurn}
                  disabled={burnLoading}
                >
                  {burnLoading ? "Colliding  " : "PLANET FOUND, COLLIDE!"}
                  {burnLoading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </div>
              <div className="addressHr mt-4"></div>
              <div className="address_details">
                <div className="d-flex justify-content-between align-items-center">
                  <p>Nonce</p>
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
    </div>
  );
};

export default Miner;
