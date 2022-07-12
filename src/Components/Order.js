/*

	Made by Adam Baran-Tomik, 29.11.2021
	GitHub: xbarantomik

*/

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Order() {
    
    let navigate = useNavigate();
    const shoppingCartFlag = 'shoppingCart';
    let order_id;
    let customer_id;
    let local_data;

    function checkInput(input, error_label){

        //checking if inputs are not empty
        if (!(input[0] && input[0].value)) {
            error_label.innerHTML = "Name is empty";
            return true;
        }
        else if (!(input[1] && input[1].value)) {
            error_label.innerHTML = "Email is empty";
            return true;
        }
        else if (!(input[2] && input[2].value)) {
            error_label.innerHTML = "Street is empty";
            return true;
        }
        else if (!(input[3] && input[3].value)) {
            error_label.innerHTML = "Street number is empty or not a number";
            return true;
        }
        else if (!(input[4] && input[4].value)) {
            error_label.innerHTML = "City is empty";
            return true;
        }
        else if (!(input[5] && input[5].value)) {
            error_label.innerHTML = "Postal code is empty or not a number";
            return true;
        }

        // checking if email has the right format
        var emailValue = input[1].value.trim().toLowerCase();
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        emailPattern.test(emailValue.toLowerCase());
        if (!(emailPattern.test(emailValue))){
            error_label.innerHTML = "Invalid email address. Try format : example@example.com";
            return true;
        }
        return false;
    }

    function registerCustomer(inputs){
        for(var i = 0; i < 6; i++){
            if (i == 1){
                inputs[i] = inputs[i].value.trim().toLowerCase();   //email
            }else{     
                inputs[i] = inputs[i].value;
            }
        }

        fetch('http://localhost:8080/regCustomer', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify(
                {
                    name: inputs[0], 
                    email: inputs[1], 
                    street: inputs[2], 
                    street_number: inputs[3], 
                    city: inputs[4], 
                    postal: inputs[5],
                }
            ),
        })
        .then(response => response.json())
        .then(data => {
            let qp =  Number(data['id']);
            console.log('Customer ID: ' + qp);
            customer_id = qp;

            createOrder();          //vytvorenie objednavky

        })
        .catch((err) =>{
            console.log('fetch /regCustomer error');
            console.log(err);
        });
    }

    function createOrder(){
        fetch('http://localhost:8080/createOrder', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify(
                {
                    customer: customer_id, 
                    completed: false,
                }
            ),
        })
        .then(response => response.json())
        .then(data => {
            order_id = data['id'];
            console.log('New order ID: ' + data['id']);

            shoppingCart();                     // pridavanie poloziek do order_product 

        })
        .catch((err) =>{
            console.log('fetch /createOrder error');
            console.log(err);
        });
    }

    function shoppingCart(){
        var toSend = JSON.parse(local_data).map(el=>Object.values(el));

        fetch('http://localhost:8080/insertToOrder', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify(
                {
                    items: toSend, 
                    orderid: order_id,
                }),
        })
        .then(() => {navigate('../thankYouPage', { replace: true });})
        .catch((err) =>{
            console.log('fetch /insertToOrder error');
            console.log(err);
        });
    }

    function order(){
        let name = document.getElementById('name');
        let email = document.getElementById('mail');
        let street = document.getElementById('street');
        let street_number = document.getElementById('streetnumber');
        let city = document.getElementById('city');
        let postal = document.getElementById('postal');
        let error_label = document.getElementById('errorlabel');
        error_label.innerHTML = "";

        let input = [name, email, street, street_number, city, postal];

        if(checkInput(input, error_label)){       // true if input is incorrect
            console.log('zle vyplnene udaje');
            return false;
        }

        local_data = localStorage.getItem(shoppingCartFlag);

        registerCustomer(input);
        localStorage.removeItem(shoppingCartFlag)
    }


    return(
        <div className="order">
            <div className="mainDiv">
            <div className="button">
                <button onClick={() => navigate('../', { replace: true })}> Main page </button><br/>
            </div>
                <form className="form">
                    <h2 className="h2"> Personal information </h2><hr/>
                    <label className="label"> Full Name </label><br/>
                    <input className="input" type="text" id="name" required=""/><br/>
                    <label className="label"> Email </label><br/>
                    <input className="input" type="text" id="mail" required=""/><br/>
                    <label className="label"> Street </label><br/>
                    <input className="input" type="text" id="street" required=""/><br/>
                    <label className="label"> Street number </label><br/>
                    <input className="input" type="number" id="streetnumber" required=""/><br/>
                    <label className="label"> City </label><br/>
                    <input className="input" type="text" id="city" required=""/><br/>
                    <label className="label"> Postal code </label><br/>
                    <input className="input" type="number" id="postal" required=""/><br/>
                </form>
                <div className="button">
                <button onClick={e => order()}> Order </button><br/>
                <h3 className="h3" id="errorlabel">  </h3><br/>
                </div>
            </div>
        </div>
    );
}

export default Order;