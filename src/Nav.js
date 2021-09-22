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
     Deep Space [Explorer]
    </Navbar.Brand>
 <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav>
      <Nav.Link href="/explore/">Explore</Nav.Link>
      <Nav.Link href="/provenance/">Provenance</Nav.Link>
      <Nav.Link href="/verify/">Verify</Nav.Link>
      <Nav.Link href="/collection/">My Collection</Nav.Link>
     
      
    </Nav>
  </Navbar.Collapse>

</Navbar>
</>
)}

export default NavComp;
