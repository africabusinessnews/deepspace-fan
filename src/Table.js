import Table from 'react-bootstrap/Table'
import {allTraits, shaData, shaFinal} from "./shaData"
import Logo from './logo'
import Nav from './Nav'
import { ContractStats } from './reusables'
const TableList = (props) =>{

    return(
        <>
         <ContractStats />
        Final Proof Hash | {' '} {shaFinal}
        <br />
        <Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Token Id</th>
      <th>SHA256 Hash</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
  {Array.from({ length: 3000 }).map((_, index) => (
                <tr>
                <td>#{index}</td>
                <td>{shaData[index]}</td>
                <td><a href={`https://gateway.pinata.cloud/ipfs/QmdDVGZijQQpvMxubwLxanU4HH8yVSk6HEsqtbtpJVugLH/${index}.png`}>IPFS Link</a></td>
                <td><a href={`/huskies/${index}`}>Details</a></td>
                
              </tr>


            ))}


  </tbody>
</Table>
</>
    )



}

export default TableList