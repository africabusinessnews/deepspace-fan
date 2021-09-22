import { ContractStats } from './reusables';
import { useState, useEffect } from 'react';
import { getContent } from './utils/cms';
import HTML2React from 'html2react'
const Intro = (props) => {

const [data, setData] = useState({Title: "Hilarious Huskies", Body: "Hilarious Huskies is an NFT collection inspired by a beautiful Siberian Husky, named Hazel."})
const huskiesonDisplay = ["310.png","217.png","218.png","109.png","logo.gif","123.png","115.png","1337.png","266.png"]

useEffect(async () => {
  setData(await getContent("website-sections/1"))

},[0]);
  


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
};

export default Intro;
