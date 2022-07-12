/*

	Made by Adam Baran-Tomik, 24.11.2021
	GitHub: xbarantomik

*/

import React from 'react';

function Product(props) {

    const shoppingCartFlag = 'shoppingCart';

    function addToShoppingCard(props){
        
        var item = localStorage.getItem(shoppingCartFlag);

        if (item == null){
            let cart = [{"id": props.id, "count": 1}];
            localStorage.setItem(shoppingCartFlag, JSON.stringify(cart));
        }
        else{
            let cart = JSON.parse(item);

            var found = false; 
            for (var i=0; i < cart.length; i++) {
                if (cart[i]['id'] == props.id){
                    cart[i]['count']++;
                    found = true;
                    break;
                }
            }
            if(!found){
                cart.push({"id": props.id, "count": 1})
            }
            localStorage.setItem(shoppingCartFlag, JSON.stringify(cart))
        }

        // vypis celej localStorage po pridavani jedneho item-u do kosika
        var ee = localStorage.getItem(shoppingCartFlag);
        console.log(ee);
    }

    return (
        <div className="product" style={{float : 'left', paddingRight : '15px'}}>
            
            <div className="h2">
                <h2> {props.name} </h2>
            </div>
            <div className="img">
                <img src={props.link} height={150} width={150}></img>
            </div>
            <div className="p">
                <p> Price: {props.price} € </p>
            </div>
            <div className="button">
                <button onClick={e => addToShoppingCard(props)}> Add to shopping card </button>
            </div>
        </div>
    );
}

export default Product;