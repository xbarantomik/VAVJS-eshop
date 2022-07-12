/*

	Made by Adam Baran-Tomik, 29.11.2021
	GitHub: xbarantomik

*/

import React, { Component } from 'react';
import { 
    BrowserRouter as Router, 
    Route, 
    Routes  
} from 'react-router-dom';
import App from './App.js';
import Admin from './Components/Admin.js';
import AdminTable from './Components/AdminTable.js';
import Order from './Components/Order.js';
import ShoppingCart from './Components/ShoppingCart.js';
import ThankYouPage from './Components/ThankYouPage.js';

class Connector extends Component {
  render() {
    return (
        <div className="Connector">
            <Router>
              <Routes >
                <Route exact path='/' element={<App/>}></Route>
                <Route exact path='/admin' element={<Admin/>}></Route>
                <Route exact path='/shoppingCart' element={<ShoppingCart/>}></Route>
                <Route exact path='/order' element={<Order/>}></Route>
                <Route exact path='/thankYouPage' element={<ThankYouPage/>}></Route>
                <Route exact path='/adminTable' element={<AdminTable/>}></Route>
              </Routes >
            </Router>
        </div>
   );
  }
}
 
export default Connector;