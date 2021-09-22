import { useEffect, useState, useRef } from "react";
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pagination from 'react-bootstrap/Pagination'
import Button from 'react-bootstrap/Button'
import Placeholder from 'react-bootstrap/Placeholder'
import Container from "react-bootstrap/Container";
import Planet from "./Planet";
import {
  getTokenSupply
 } from "./utils/interact.js";


const List = (props) => {

    const [planetMeta, setplanetMeta] = useState([]);
    const [planetMetaLoaded, setplanetMetaLoaded] = useState(false);
    const [page, setPage] = useState(1);

    const numberperpage = 8

    useEffect(async () => {
    
        getplanetMeta();


    }, [page]);

    let start = (page * numberperpage)
    let end = ((page + 1) * numberperpage)
    
    const getplanetMeta = async () => {
        
    let resultArray = []

    for(let i=start; i<end;i++){

        const response = await fetch(`https://cloud-cube-us2.s3.amazonaws.com/deepspace/public/planet/metadata/${i}`);
        const answer = await response.json()

        console.log(answer)
        resultArray.push(answer)

    }      
     setplanetMeta(resultArray)
     setplanetMetaLoaded(true)
    };


    const onPagePress = (pageNum)=> { //TODO: implement
        setplanetMetaLoaded(false)
        setPage(pageNum)
      };

      
    
 
    return (
      <div class="min-h-full">
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
    {planetMeta.map((planet, index) => (
      <Col key={planet.name}>

     <Planet key={planet.name + index} tokenidprop={index + 1} />
      
  
       </Col>
    ))}
  </Row>
<div class="flex justify-center">

  <Pagination size={"lg"}>
  <Pagination.First onClick={() => onPagePress(0)} />
  <Pagination.Prev onClick={() => onPagePress(page - 1)}/>

  <Pagination.Next onClick={() => onPagePress(page + 1)}/>
  <Pagination.Last onClick={() => onPagePress((3000/numberperpage)-1)}/>
</Pagination>
</div>
</div>
    );
  }
  
export default List;

