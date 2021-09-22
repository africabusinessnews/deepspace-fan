import Intro from './Intro'
import { createBrowserHistory } from 'history';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Explore from './Explore'
import Mint from './Mint';
import { Helmet } from 'react-helmet';
import banner from "./media/banner.jpg"
import NavComp from './Nav';    
import Verify from './Verify';
import Wallet from "./Wallet";
import MyCollection from './MyCollection';
const history = createBrowserHistory();


function App() {

  return (
    <>
    <Helmet>
    <title>Deep Space Explorer</title>
       </Helmet>
    <Wallet />
   
      </>
  );
}

export default App;
