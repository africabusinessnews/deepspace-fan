import { useEffect, useState, useRef } from "react";
import Button from 'react-bootstrap/Button'
import { getContent } from './utils/cms';
import HTML2React from 'html2react'


const Verify = (props) => {

    const refContainer = useRef(0);

    const [data, setData] = useState({Title: "Verify", Body: "Hilarious Huskies is an NFT collection inspired by a beautiful Siberian Husky, named Hazel."})
    const huskiesonDisplay = ["310.png","217.png","218.png","109.png","logo.gif","123.png","115.png","1337.png","266.png"]
    
    useEffect(async () => {
      setData(await getContent("website-sections/4"))
    
    },[0]);

      const onGo = (e)=> { //TODO: implement
        let huskyToken = refContainer.current.value
        if(huskyToken > 2999){
          huskyToken = 2999
        }
        if(huskyToken < 0){
          huskyToken = 0
        }
        console.log(huskyToken)
        e.preventDefault()
        window.location.href=`/huskies/${huskyToken}`

      };
    
 
    return (

      <>
    <div class="flex">
    <div class="mx-auto">     

    <div class="flex flex-wrap align-middle md:justify-center pt-2">

        <div class="sm:w-full lg:w-1/2">
        <h1 class="text-6xl md:text-6xl xl:text-9xl font-bold">{data.Title}</h1>

        <div class="pr-5 py-3">
        <div class="lg:text-base xl:text-lg pb-2 text">    
        {HTML2React(data.Body)}  
        </div>

        <div class="w-full lg:w-2/3 my-3 p-3 border-2 ">
      
      <form onSubmit={onGo}>
      
      <div class="flex flex-wrap justify-left items-center align-middle space-x-3 ">
   
        <label class="text-lg font-semibold" for="tokenId">Enter HUSK Token ID</label>
        <input ref={refContainer} id="tokenId" type="number" min="0" max="2999" class="rounded" />
   
        <Button variant="dark" onClick={onGo}>Go</Button>
   
      </div>
      </form>
      </div>

 </div>
</div>

     <div class="hidden lg:w-1/2 md:flex md:flex-wrap">
    {Array.from({ length: 9 }).map((_, index) => (
      <div key={index} class="p-1 w-1/3">
    <img class="shadow-lg rounded-3xl" src={`https://huskies.s3.eu-west-2.amazonaws.com/images/${huskiesonDisplay[index]}`} />
    </div>
  ))}
  </div>
     
      </div>      
      
     
      </div>
     
 </div>


</>


    );
  }
  
export default Verify;

