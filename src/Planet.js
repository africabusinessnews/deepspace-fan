import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Placeholder from 'react-bootstrap/Placeholder'
import {contract} from "./contract";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

  require('dotenv').config();

  const API_URL = process.env.REACT_APP_ALCHEMY_KEY;
  const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  const web3 = createAlchemyWeb3(API_URL);

const Planet = ({tokenidprop, owed}) => {

    let { tokenId } = useParams();
    
    if(tokenidprop > -1) tokenId = tokenidprop

    const [planetProv, setplanetProv] = useState("Loading...");
    const [planetMeta, setPlanetMeta] = useState("Loading...");
    const placeholderImg = "https://cloud-cube-us2.s3.amazonaws.com/deepspace/public/base.png"
    const imageSrc = `https://cloud-cube-us2.s3.amazonaws.com/deepspace/public/planet/image/${tokenId}.png`
    const contractAddress= "0x1E4e1208Ab4BA7740FE73D3728DF1f89bE6C649b"
    const [mintedFlag, setMintedFlag] = useState(false);
    const [loadedFlag, setloadedFlag] = useState(false);
    const [owedWeb3, setOwedWeb3] = useState(0);
    
  

    const init = {
        method: 'GET', 
        headers: {
        }
    }

    useEffect(async () => {   
    
    getplanetProvenance()
    

    }, [tokenId]);

const getplanetProvenance = async () => {

        // set school contract
        const spaceInstance = new web3.eth.Contract(contract.abi,contractAddress);
    
   
    
    
  
    let osRequest
    let osResponse
    let responseString

        try{
            osRequest = await fetch(`https://deepspace.huskies.workers.dev/?token=${tokenId}`, init);
            osResponse = await osRequest.json()

            setPlanetMeta(osResponse.traits)
         
        }catch(e){console.log(e)}
                 
            if(osResponse.success === false){
                setplanetProv(<ListGroup.Item> {"Not explored (minted) yet"}</ListGroup.Item> )
                setloadedFlag(true)
            }

            if(osResponse.detail){
                setplanetProv(<ListGroup.Item>{`${osResponse.detail}.. by those bastards at OS. Wait a second then try again.`}</ListGroup.Item> )
                setloadedFlag(true)
            }
            

            if(osResponse.top_ownerships){
               
                let owneraddress = osResponse.top_ownerships[0].owner.address
                let rockSummary = await spaceInstance.methods.userRockLevelSummary(owneraddress).call();
              
                responseString = osResponse.top_ownerships.map((owner, index) =>{
                    
                    

                    rockSummary.map((item)=>{

                        if(item.amountOwed > 0 && item.tokenId === osResponse.token_id){
                          
                        
                          let salePrice 
                        
                          try{
                            salePrice = osResponse.orders[0].base_price
                              }catch(e){console.log(e)}
                          
                          let salesobj = {
                            
                                        amountOwed: item.amountOwed ? web3.utils.fromWei(item.amountOwed):null,
                                        cost: salePrice ? web3.utils.fromWei(salePrice) : null,
                                                  
                          }
    
                          setOwedWeb3(salesobj)
    
                  }
                })

                        return(
                        <>
                        <ListGroup.Item key={index}> Owner Address: <span class="font-medium"><a href={`https://etherscan.io/address/${owner.owner.address}`}>
                        {owner.owner.address}</a></span></ListGroup.Item>
                        {owner.owner.user &&
                        (<>                        
                                 {owner.owner.user.username && (
                                <>
                                <ListGroup.Item key={index}>
                                     Owner:{" "}
                                 <span class="font-medium">
                                     {owner.owner.user.username}
                                </span>
                                </ListGroup.Item>
                                </>

                                 )}
                                
                       </>)}
                        </>)
                    
                })
               
                setplanetProv(responseString)
                setMintedFlag(true)
                setloadedFlag(true)
    
            }
        }



      const image = imageSrc

      const heading = `Planet #${tokenId}`

     
  
return (
    <div class="max-w-lg py-2">
       <Card>
       {mintedFlag ? (<Card.Img variant="top" alt={heading} src={image} />) : (<Card.Img variant="top" alt={heading} src={placeholderImg} />)}
        <Card.Body> 
                {loadedFlag ? (
                    <>
                   <Card.Title>Planet #{tokenId}</Card.Title>
                  
                       {mintedFlag && (
                            <ListGroup variant="flush">
                                <Card.Header>Traits</Card.Header>

                                {planetMeta.map((trait, index) => {

                                    return( <ListGroup.Item><span class="font-medium">{trait.trait_type}</span> {trait.value}</ListGroup.Item>)
                                })}
                              
                               
                               
                                </ListGroup>
                       )}
                   

                   <ListGroup variant="flush">
                   <Card.Header>Ownership Stuff</Card.Header>
                   {planetProv}
                   <ListGroup.Item><span class="font-medium">Owed:</span> {owed ? owed : owedWeb3.amountOwed}</ListGroup.Item>
                   
                   </ListGroup>  
                   </>  
                   ) : (
                    <>
                           <Placeholder as={Card.Title} animation="glow"><Placeholder xs={8} /></Placeholder>
                           <Placeholder as={Card.Text} animation="glow">
                               <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                               <Placeholder xs={6} /> <Placeholder xs={8} />
                           </Placeholder>
                          
                    </>  
                 )                  

                   
                   }               
          </Card.Body>            
        </Card>
    </div>
  );
};

export default Planet;


