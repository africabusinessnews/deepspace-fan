import React, { useEffect, useState } from "react";
import SectionTitle from "../SectionTitle/SectionTitle";
import aud from "../../assets/images/audio.wav";
import "./Miner.css";
import { Spinner } from "react-bootstrap";

//656s
const Miner = (props) => {
  const [mintCost, setMintCost] = useState("0");
  const [currentTokenId, setCurrentTokenId] = useState(0);
  const [nonce, setNonce] = useState(0);
  // const [currentBlockNum, setCurrentBlockNum] = useState();
  const [mineInProgress, setMineInProgress] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [showMsg, setMsg] = useState();

  let audio = new Audio(aud);
  const startAudio = () => {
    audio.play();
    document.querySelector(".exploring").style.display = "none";
    document.querySelector(".explored").style.display = "block";
  };

  const updateMintDetails = async () => {
    // const blockNum = await props.web3.eth.getBlockNumber();
    // setCurrentBlockNum(blockNum);

    const powDetails = await props.space.methods.powDetails().call();
    setMintCost(powDetails.mintCost);

    const token = await props.space.methods.currentTokenId().call();
    setCurrentTokenId(token);
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

  useEffect(() => {
    const mine = async () => {
      if (mineInProgress) {
        try {
          const accounts = await props.web3.eth.getAccounts();
          let result = await props.space.methods
            .verifyProofOfWork(accounts[0], nonce)
            .call();
          let powHashFound = result[0];
          if (!powHashFound) {
            setNonce(nonce + 1);
            return;
          } else {
            startAudio();
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
    document.querySelector(".startTimer").style.display = "none";
    document.querySelector(".exploring").style.display = "block";
  }

  function pauseMining() {
    setMineInProgress(false);
    document.querySelector(".startTimer").style.display = "block";
    document.querySelector(".exploring").style.display = "none";
  }

  const tryMint = async () => {
    setMintLoading(true);
    const accounts = await props.web3.eth.getAccounts();
    try {
      await props.space.methods
        .mintTo(accounts[0], nonce)
        .send({ from: accounts[0], value: mintCost });
      setMsg("Mint Successful!");
    } catch (err) {
      console.log(err.message);
      setMsg("Uh oh! Someone has already explored that planet 😕");
    }
    setMintLoading(false);
    setMineInProgress(false);
    setNonce(0);

    document.querySelector(".startTimer").style.display = "block";
    document.querySelector(".explored").style.display = "none";
  };

  return (
    <div className="miner">
      <SectionTitle title="Miner" />
      <div className="addressRow">
        <div className="wallet_address col-lg-10">
          <div className="col-lg-10 mx-auto px-3">
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Total planets mined</p>
                <h6>{currentTokenId}</h6>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p>Current mint cost</p>
                <h6>{`${props.web3.utils.fromWei(mintCost, "ether")}`}</h6>
              </div>
            </div>
            <div className="addressHr"></div>
            <div className="addressBtnGroup">
              <button
                className="connect w-100 startTimer"
                onClick={startMining}
              >
                Start exploring
              </button>
              <button className="connect w-100 exploring" onClick={pauseMining}>
                Exploring...
              </button>
              <button
                className={`connect w-100 explored ${
                  mintLoading ? "loading" : ""
                }`}
                onClick={tryMint}
                disabled={mintLoading}
              >
                {mintLoading ? "Minting  " : "PLANET FOUND, MINT!"}
                {mintLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
            <div className="addressHr mt-4"></div>
            <div className="address_details">
              <div className="d-flex justify-content-between align-items-center">
                <p>Nonce</p>
                <h6 className="count">{nonce}</h6>
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
