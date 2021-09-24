import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Placeholder from 'react-bootstrap/Placeholder'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";


const Planet = ({tokenidprop, owed}) => {

    let { tokenId } = useParams();
    
    if(tokenidprop > -1) tokenId = tokenidprop

    const [planetProv, setplanetProv] = useState("Loading...");
    const [planetMeta, setPlanetMeta] = useState("Loading...");
    const placeholderImg = "https://cloud-cube-us2.s3.amazonaws.com/deepspace/public/base.png"
    const imageSrc = `https://cloud-cube-us2.s3.amazonaws.com/deepspace/public/planet/image/${tokenId}.png`
   
    const [mintedFlag, setMintedFlag] = useState(false);
    const [loadedFlag, setloadedFlag] = useState(false);
    
  

    const init = {
        method: 'GET', 
        headers: {
        }
    }

    useEffect(async () => {   
        if(tokenId < 10000 ) {
            getplanetProvenance()
        }

    }, [tokenId]);

const getplanetProvenance = async () => {

  
    let osRequest
    let osResponse
    let metaRequest
    let metaResponse
    let responseString

        try{
            osRequest = await fetch(`https://deepspace.huskies.workers.dev/?token=${tokenId}`, init);
            metaRequest = await fetch(`https://cloud-cube-us2.s3.amazonaws.com/deepspace/public/planet/metadata/${tokenId}`, init);
            osResponse = await osRequest.json()
            metaResponse = await metaRequest.json()
            setPlanetMeta(metaResponse)

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
               
                responseString = osResponse.top_ownerships.map((owner, index) =>{
                    
                        return(
                        <>
                        <ListGroup.Item key={index}> Owner Address: <span class="font-medium"><a href={`https://etherscan.io/address/${owner.owner.address}`}>
                        {owner.owner.address}</a></span></ListGroup.Item>
                        {owner.owner.user &&
                        (<>
                        <ListGroup.Item key={index}>
                                 Owner:{" "}
                                 <span class="font-medium">
                                     {owner.owner.user.username}
                                </span>
                        </ListGroup.Item></>)}
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

                                {planetMeta.attributes.map((trait, index) => {

                                    return( <ListGroup.Item><span class="font-medium">{trait.trait_type}</span> {trait.value}</ListGroup.Item>)
                                })}
                              
                               
                               
                                </ListGroup>
                       )}
                   

                   <ListGroup variant="flush">
                   <Card.Header>Provenance</Card.Header>
                   {planetProv}
                   <ListGroup.Item><span class="font-medium">Owed:</span> {owed}</ListGroup.Item>
                   
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

