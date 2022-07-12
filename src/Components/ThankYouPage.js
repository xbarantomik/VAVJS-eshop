/*

	Made by Adam Baran-Tomik, 02.12.2021
	GitHub: xbarantomik

*/

import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function ThankYouPage() {
    
    let navigate = useNavigate();

    function getForTYP(){
        fetch('http://localhost:8080/typData',{
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        }) 
        .then(data => data.json())
        .then(data => {
            // console.log(data[0]['link']);
            document.getElementById('ty_image').src=data[0]['image'];
            document.getElementById('ty_link').href=data[0]['link'];
        })
        .catch(err => {console.log(err)});
    }

    useEffect(()=>{
        getForTYP();
    },[]);

    function thank_you(){
        fetch('http://localhost:8080/counterInc', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify(
                {
                    count: 1, 
                }
            ),
        })
        .then(() => {navigate('../', { replace: true });})

        .catch((err) =>{
            console.log('fetch /thank_you error');
            console.log(err);
        });
    }


    return(
        <div className="order">
            <div className="mainDiv">
                <h1 className="h1"> Thank you! </h1><hr/>
                <a href="" id="ty_link" onClick={e => thank_you()}> Suprise me link </a><br/>
                <img className="label" id="ty_image" src=""></img><br/>
            </div>
        </div>
    );
}

export default ThankYouPage;