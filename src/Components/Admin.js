/*

	Made by Adam Baran-Tomik, 29.11.2021
	GitHub: xbarantomik

*/

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    

    const [order_data, setData] = useState([]);
    const [product_data, setProductData] = useState([]);
    const [typ_data, setTYPdata] = useState([]);

    let navigate = useNavigate();

    async function getOrders(){ 
        let response = await fetch('http://localhost:8080/adminOrders');  
        response = await response.json();
        return response;
    }

    async function getProduct(){ 
        let response = await fetch('http://localhost:8080/data');  
        response = await response.json();
        return response;
    }

    async function getThankYouPage(){ 
        let response = await fetch('http://localhost:8080/typData');  
        response = await response.json();
        return response;
    }

    function fre(){
        let ordr = getOrders();
        ordr.then(function(result) {
            setData([result]);
        })

        let pdrct = getProduct();
        pdrct.then(function(result2) {
            setProductData([result2]);
        })

        let thnkpg = getThankYouPage();
        thnkpg.then(function(result3) {
            setTYPdata([result3]);
        })
    }

    useEffect(()=>{
        fre();
    }, []);


    function loadAdminTables(){
        navigate('../adminTable', {state: {order: order_data, product: product_data, typ: typ_data} });
    }

    return (
        <div className="App">
            <div>
              <h2 className="h2"> Admin </h2>
            </div>
            <div className="button">
                <button onClick={() => navigate('../', { replace: true })}> Main page </button>
            </div><br/>
            <div className="button">
                <button onClick={e => loadAdminTables()}> Show data </button>
            </div><br/>
        </div>
    );
}

export default Admin;

