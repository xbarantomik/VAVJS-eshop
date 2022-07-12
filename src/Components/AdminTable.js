/*

	Made by Adam Baran-Tomik, 02.12.2021
	GitHub: xbarantomik

*/

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminTable() {

    const location = useLocation();
    let navigate = useNavigate();
    let order_data = [];
    let product_data = [];
    let typ_data = [];

    function getOrdersFromLocationState(prop){ 
        order_data = prop['state']['order'];
        product_data = prop['state']['product'];
        typ_data = prop['state']['typ'];
    }

    function pay(orderid, completed){
        if(completed === 'false'){
            fetch('http://localhost:8080/completeOrder', {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        orderID: orderid,
                    }
                ),
            })
            .then(() => {
                navigate('../admin');
                }
            )
            .catch((err) =>{
                console.log('fetch /completeOrder error');
                console.log(err);
            });
        }
    }


    function getPrice(order_products){
        let sum = 0;
        for (var i=0; i < order_products.length; i++) {
            for (var j=0; i < product_data[0].length; j++) {
                if (order_products[i].productID === product_data[0][j].id){
                    sum += order_products[i].amount * product_data[0][j].price;
                    break;
                }
            }
        }
        return Number(sum);
    }

    function productsInOrder(order_products){
        let products_niced = [];

        for (var i=0; i < order_products.length; i++) {
            for (var j=0; i < product_data[0].length; j++) {
                if (order_products[i].productID === product_data[0][j].id){
                    products_niced.push({
                        id: product_data[0][j].id,
                        name: product_data[0][j].name,
                        amount: order_products[i].amount,
                    })
                    break;
                }
            }
        }
        return JSON.stringify(products_niced);
    }


    function listOrderTable(){

        let order_data2 = order_data[0];
        let x = 0;
        return order_data2.map((element, index) => {
            return (
                <tr id={x++}>               
                    <td>{element.orderID}</td>
                    <td>{element.customerID}</td>
                    <td>{productsInOrder(element.products)}</td>
                    <td>{getPrice(element.products)}€</td>
                    <td>{element.Completed}</td>
                    <td><button onClick={e => pay(element.orderID, element.Completed)}> Pay </button></td>
                </tr>
            );
        });
    }

    /*
    if link or image in ThankYouPage changed, it will post the new data
    */
    function changeTYP(linkID, imageID, oldLink, oldImage){

        let somethingChanged = true;
        let link = document.getElementById(linkID).value;
        let image = document.getElementById(imageID).value;

        if((!link && link.length === 0 )){
            link = oldLink;
        }
        if((!image && image.length === 0 )){
            image = oldImage;
        }
        if (link === oldLink && image === oldImage){
            somethingChanged = false;
        }

        if(somethingChanged){
            fetch('http://localhost:8080/changeTYP', {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        newLink: link,
                        newImage: image,
                    }
                ),
            })
            .then(() => {
                navigate('../admin');
                }
            )
            .catch((err) =>{
                console.log('fetch /changeTYP error');
                console.log(err);
            });
        }
    }

    function resetCounter(counter){

        if(counter != 0){
            fetch('http://localhost:8080/resetCounter', {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({}),
            })
            .then(() => {
                navigate('../admin');
                }
            )
            .catch((err) =>{
                console.log('fetch /resetCounter error');
                console.log(err);
            });
        }
    }
    

    function listCounter(){
        let typ_data2 = typ_data[0];

        let x = 0;
        return typ_data2.map((element, index) => {
            return (
                <tr id={x++}>
                    <td>{element.counter}</td>
                    <td><button onClick={e => resetCounter(element.counter)}> Reset </button></td>
                </tr>
            );
        });
    }

    function listTYPTable(){
        let typ_data2 = typ_data[0];

        let x = 0;
        return typ_data2.map((element, index) => {
            return (
                <tr id={x++}>
                    <td>{element.link}</td>
                    <td>{element.image}</td>
                    <td><input placeholder="new link" type="text" id="linkID"></input></td>
                    <td><input placeholder="new image link" type="text" id="imageID"></input></td>
                    <td><button onClick={e => changeTYP('linkID', 'imageID', element.link, element.image)}> Save </button></td>
                </tr>
            );
        });
    }
    

    return (
        <div className="adminTables">
        <div className="button">
            <button onClick={() => navigate('../', { replace: true })}> Main page </button>
        </div>
        <div>
            {
                getOrdersFromLocationState(location)
            }
        </div>
        <div className="h2">
            <h2> Orders </h2>
        </div>
        <table id="orders" border="2">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer ID</th>
                    <th>Products</th>
                    <th>Price</th>
                    <th>Completed</th>
                    <th>Pay</th>
                </tr>
            </thead>
            <tbody>
                {            
                    listOrderTable()
                }
            </tbody>
        </table><br/>
        <div className="h2">
            <h2> Thank You Page </h2>
        </div>
        <table id="thankyoupage" border="2">
            <thead>
                <tr>
                    <th>Counter</th>
                    <th>Reset</th>
                </tr>
            </thead>
            <tbody>
                {            
                    listCounter()
                }
            </tbody>
        </table><br/>
        <table id="thankyoupage" border="2">
            <thead>
                <tr>
                    <th>Link</th>
                    <th>Image</th>
                    <th>Change Link</th>
                    <th>Change Image</th>
                    <th>Confirm</th>
                </tr>
            </thead>
            <tbody>
                {            
                    listTYPTable()
                }
            </tbody>
        </table><br/>
    </div>
    );
}

export default AdminTable;