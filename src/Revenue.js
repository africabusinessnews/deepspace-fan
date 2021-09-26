import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {contract} from "./contract";

require('dotenv').config();

const API_URL = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const Revenue = () => {

const contractAddress= "0x1E4e1208Ab4BA7740FE73D3728DF1f89bE6C649b"
const [totalPlanets, setTotalPlanets] = useState(0);
const [rockswithrev, setRockswithrev] = useState();
const [currentIndex, setCurrentIndex] = useState();

const cfinit = {method: 'GET', headers: { } }

useEffect(() => {

  const init = async () => {
    // set school contract
    const spaceInstance = new web3.eth.Contract(
      contract.abi,
      contractAddress
    );

    const totalPlanets = await spaceInstance.methods.totalSupply().call();
    const tokenPlanets = await spaceInstance.methods.currentTokenId().call();

    setTotalPlanets(tokenPlanets)

    let arr = []
    let objectof
    let listedforsale = false

      for(let i =1; i<totalPlanets; i++){

        try{
          let data = await fetch(`https://deepspace.huskies.workers.dev/?token=${i}`, cfinit)
          let response = await data.json()

          if(response.orders.length > 0){listedforsale = true}
          let address = response.owner.address

          if(address !== "0x0000000000000000000000000000000000000000"){

              let rockSummary = await spaceInstance.methods.userRockLevelSummary(address).call();
              const summary = await spaceInstance.methods.userHighLevelSummary(address).call();
            

               rockSummary.map((item)=>{

                    if(item.amountOwed > 0 && item.tokenId === response.token_id){
                      
                      let traitType
                      let salePrice 
                      response.traits.map((trait)=>{
                        if(trait.trait_type === "Type"){
                          traitType = trait.value
                        }
                      })

                      try{
                        salePrice = response.orders[0].base_price
                          }catch(e){console.log(i,e)}
                      
                      objectof = {
                        
                                    tokenid: item.tokenId,
                                    amountOwed: item.amountOwed ? web3.utils.fromWei(item.amountOwed):null,
                                    rewarded: item.amountRewarded ? web3.utils.fromWei(item.amountRewarded) : null,
                                    trait: traitType,
                                    cost: salePrice ? web3.utils.fromWei(salePrice) : null,
                                    contract_address:address,
                                    ownerReward: summary.amountRewarded ? web3.utils.fromWei(summary.amountRewarded) : null,
                                    osResponse: response                
                      }

                     arr.push(objectof)
               setCurrentIndex(i)

              }
            })

          setRockswithrev(arr)  
          }
                   
           }catch(e){console.log(e, i)}
        
      }


  };


      
  init()

}, []);


return (
    <>
      
<div class="flex flex-wrap">

<h1>Summary of planets with sales prices on OS and eth owed</h1>

<table class="table-auto">

  <thead>
    <tr class="text-lg font-semibold">
    <th class="text-center">Token ID</th>
      <th>Amount owed</th>
      <th>Trait</th>
      <th>Cost</th>
      <th>Net Cost</th>
      <th>Owner Address</th>
      <th>Owner Total Payout</th>
    </tr>
    </thead>
    <tbody>
  {rockswithrev && (rockswithrev.map((rock)=>{

    return(<>
    <tr>
    <td class="text-center">
    <a target="_blank" href={`https://opensea.io/assets/0x1e4e1208ab4ba7740fe73d3728df1f89be6c649b/${rock.tokenid}`}>{rock.tokenid}</a>
    </td>
    <td class="text-center">{rock.amountOwed}</td>
    <td>{rock.trait}</td>
    <td class="text-center">
      <a target="_blank" href={`https://opensea.io/assets/0x1e4e1208ab4ba7740fe73d3728df1f89be6c649b/${rock.tokenid}`}>{rock.cost}</a>
    </td>
    <td>{
      rock.cost &&(
    
    rock.cost - rock.amountOwed)}</td>
    <td>{rock.contract_address}</td>
    <td>{rock.ownerReward}</td>

    
    </tr>
    </>)

    }))}
</tbody>
</table>
 
</div>
    </>
  );
};

export default Revenue;
