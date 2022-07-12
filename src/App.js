/*

	Made by Adam Baran-Tomik, 21.11.2021
	GitHub: xbarantomik

*/

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Product from './Components/Product.js';

function App() {

  const [produck_data, setData] = useState([]);
  let navigate = useNavigate();

  function getProduct(){
    fetch('http://localhost:8080/data')   // ,{headers: {'Access-Control-Allow-Origin':'*'}}
    .then(data => data.json())
    .then(data => setData(data))
    .catch(err => {console.log(err)});
  }

  function listAllProcucts(){
    return  produck_data.map((products) => {
        return <Product
            id = {products['id']}
            name = {products['name']}
            link = {products['picture_link']}
            price = {products['price']}
          />
    });
  }

  useEffect(()=>{
      getProduct();
  },[]);


  const toShoppingCart = ()=>{
    navigate('../shoppingCart', {state: produck_data });
  }
  
  return (
    <div className="App">
        <div>
          <button onClick={()=>{toShoppingCart()}}> Shopping Cart </button>
        </div><hr/>
        <div>
          {
            listAllProcucts()
          }
        </div>
    </div>
  );    
}
  
export default App;