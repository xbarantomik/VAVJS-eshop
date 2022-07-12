/*

	Made by Adam Baran-Tomik, 24.11.2021
	GitHub: xbarantomik

*/

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ShoppingCart() {

    const shoppingCartFlag = 'shoppingCart';

    let navigate = useNavigate();
    const location = useLocation();
    let produck_data = [];
    let total_price = 0;

    function getProductsFromLocationState(prop){ 
        produck_data = prop['state'];
    }

    function productsInShoppingCart(localS){

        let items = JSON.parse(localS)
        let inCart = [];

        let produck_data2 = produck_data;

        for (var i=0; i < items.length; i++) {
            for (var j=0; i < produck_data2.length; j++) {
                if (items[i]['id'] === produck_data2[j]['id']){
                    produck_data2[j]["count"] = items[i]['count'];
                    inCart.push(produck_data2[j]);
                    break;
                }
            }
        }
        return inCart;
    }

    function getTotal(inCart){
        let sum = 0;
        for (var i=0; i < inCart.length; i++) {
            sum += inCart[i]['price'] * inCart[i]['count'];
        }
        total_price = sum;
    }


    function listShoppingCart(){

        let local_s_data = localStorage.getItem(shoppingCartFlag);
        if (local_s_data != null){
            let inCart = productsInShoppingCart(local_s_data);
            getTotal(inCart);
            let x = 0;
            return inCart.map((element) => {
                return (
                    <tr id={x++}>               
                        <td>{element['name']}</td>
                        <td>{element['price']}€</td>
                        <td>{element['count']}</td>
                        <td>{element['count']*element['price']}€</td>
                    </tr>
                );
            });
        }
        else{
            console.log('local session je empty');
            return (
                <h2> Your Shopping cart is empty </h2>
            );
        }
    }

    function next(){
        var local_storage = localStorage.getItem(shoppingCartFlag);
        if(local_storage != null){
            navigate('../order', { replace: true });
        }
    }

    return (
        <div className="shoppingCart">
            <div className="button">
                <button onClick={() => navigate('../', { replace: true })}> Main page </button><br/>
                <h2> Shopping cart </h2><hr/>
            </div>
            <div>
                {
                    getProductsFromLocationState(location)
                }
            </div>
            <table id="products" border="2">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>SUM</th>
                    </tr>
                </thead>
                <tbody>
                    {listShoppingCart()}
                </tbody>
            </table><br/>
            <table id="total" border="2">
                <thead>
                    <tr><th>TOTAL</th></tr>
                </thead>
                <tbody>
                    <tr><th>{total_price}€</th></tr>
                </tbody>
            </table><br/>
            <div className="order">
                <button onClick={e => next()}>Next</button>
            </div>
        </div>
    );
}

export default ShoppingCart;