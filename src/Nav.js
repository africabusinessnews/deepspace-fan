import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import mobileLogo from './media/logo.gif'
import ConnectWallet from './ConnectWallet';  


const NavComp = (props) => {

  return (
    <>
    <div class="flex justify-end pt-3">
      <ConnectWallet />
      </div>
 <Navbar collapseOnSelect expand="md">
  <Navbar.Brand href="/">
      <img
        src={mobileLogo}
        width="40"
        height="40"
        className="d-inline-block align-middle"
        
        alt="HilariousHuskies Logo"
      />{' '}<span class="font-bold break-words">Hilarious Huskies</span>
    </Navbar.Brand>
 <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav>
      <Nav.Link href="/faq/">FAQ's</Nav.Link>
      <Nav.Link href="/mint/">Mint</Nav.Link>
      <Nav.Link href="/huskies/">Explore</Nav.Link>
      {/*<Nav.Link href="/provenance/">Provenance</Nav.Link>*/}
      <Nav.Link href="/verify/">Verify</Nav.Link>
      <Nav.Link href="/team/">Team</Nav.Link>
     
      
    </Nav>
  </Navbar.Collapse>

</Navbar>
</>
)}

export default NavComp;
