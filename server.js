/*

	Made by Adam Baran-Tomik, 21.11.2021
	GitHub: xbarantomik

*/

const mysql = require('mysql');
const path = require('path');
const express = require('express');
const app = express();
const port = 8080; 

const cors = require('cors');   // na FE to robilo problemy a chcelo toto

// app.use("/static", express.static('./static/'));
app.use(express.static('static'));

app.use(cors());
app.use(express.json()); 

var pool = mysql.createPool({
    host: 'mydb',
    user: 'root',
    password: 'root', 
    multipleStatements: true        // bez tohto nechelo brat raw sql nizsie
});

pool.getConnection(function(err, connection) {
    if (err) {
        console.log('prd');
        throw err;
    }
    connection.query(`

        DROP DATABASE IF EXISTS \`eshop\`;
        CREATE DATABASE \`eshop\`;
        USE \`eshop\`;

        CREATE TABLE IF NOT EXISTS \`product\` (
            \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            \`name\` varchar(255) COLLATE utf8_general_ci NOT NULL,
            \`picture_link\` varchar(255) COLLATE utf8_general_ci NOT NULL,
            \`price\` double NULL
        )ENGINE=InnoDB;
    
        INSERT IGNORE INTO \`product\` (\`name\`, \`picture_link\`, \`price\`) VALUES
        ('Printer', 'https://thumbs.dreamstime.com/z/realistic-printer-illustration-2511018.jpg', 120),
        ('Hairdryer', 'https://thumbs.dreamstime.com/z/hairdryer-8141982.jpg', 22),
        ('Smart watch', 'https://thumbs.dreamstime.com/z/wireless-smart-watch-isolated-white-background-wireless-smart-watch-isolated-white-132583240.jpg', 195);
        
        CREATE TABLE IF NOT EXISTS\`customer\` (
            \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            \`name\` varchar(60) COLLATE utf8_general_ci NOT NULL,
            \`email\` varchar(40) COLLATE utf8_general_ci NOT NULL,
            \`street\` varchar(60) COLLATE utf8_general_ci NOT NULL,
            \`street_number\` varchar(60) COLLATE utf8_general_ci NOT NULL,
            \`city\` varchar(30) COLLATE utf8_general_ci NOT NULL,
            \`postal_code\` varchar(60) COLLATE utf8_general_ci NOT NULL
        )ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS \`order\` (
            \`id\` int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
            \`customer_id\` int NOT NULL,
            \`completed\` varchar(5) COLLATE utf8_general_ci NOT NULL,
            KEY \`customer_id\` (\`customer_id\`),
            CONSTRAINT order_fk_product FOREIGN KEY (\`customer_id\`) REFERENCES \`customer\` (\`id\`) ON DELETE CASCADE
        )ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS \`order_product\` (
            \`id\` int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
            \`amount\` int unsigned NOT NULL,
            \`order_id\` int unsigned NOT NULL,
            \`product_id\` int NOT NULL,
            KEY \`order_id\` (\`order_id\`),
            KEY \`product_id\` (\`product_id\`),
            CONSTRAINT order_product_fk_order FOREIGN KEY (\`order_id\`) REFERENCES \`order\` (\`id\`)  ON DELETE CASCADE,
            CONSTRAINT order_product_fk_product FOREIGN KEY (\`product_id\`) REFERENCES \`product\` (\`id\`) ON DELETE CASCADE
        )ENGINE=InnoDB;
        
        CREATE TABLE IF NOT EXISTS \`thank_you_page\` (
            \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            \`counter\` int NOT NULL,
            \`link\` varchar(255) COLLATE utf8_general_ci NOT NULL,
            \`image\` varchar(255) COLLATE utf8_general_ci NOT NULL
        )ENGINE=InnoDB;

        INSERT IGNORE INTO \`thank_you_page\` (\`counter\`, \`link\`, \`image\`)
        VALUES (0, 'https://www.obi.sk/sekery-a-kladiva/lux-setrne-kladivo-54-mm-comfort/p/1099795', 'https://thumbs.dreamstime.com/z/repairman-hammer-wood-plank-27733812.jpg');

    `,
        (function () {
            console.log('database created');
        }())
    )
    connection.release();
});


app.get("/data", function(req, res){
    console.log('eshop.get/data');
    pool.query(`USE eshop; SELECT * FROM product;`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "GET data request failed"}));
            throw error;
        }
        res.status(200).end(JSON.stringify(results[1]));
    })
});

app.get("/typData", function(req, res){
    console.log('eshop.get/typData');
    pool.query(`USE eshop; SELECT * FROM thank_you_page;`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "GET typData request failed"}));
            throw error;
        }
        res.status(200).end(JSON.stringify(results[1]));
    })
});


app.get("/adminOrders", function(req, res){
    console.log('eshop.get/adminOrders');
    pool.query(`USE \`eshop\`; SELECT * FROM \`order\`;`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "GET adminOrders order failed"}));
            throw error;
        }

        let fin = [];
        results[1].forEach((el, index) =>{
            let orderid = Number(results[1][index].id);
            let customerid = Number(results[1][index].customer_id);
            let completed = results[1][index].completed;
    
            pool.query(`USE \`eshop\`; SELECT \`amount\`, \`product_id\` FROM \`order_product\` WHERE order_id=${orderid};`, function (error, res2, fields) {
                if (error) {
                    res.status(500).end(JSON.stringify({"Status" : "GET adminOrders order_product failed"}));
                    throw error;
                }
                
                let mid = [];
                res2[1].forEach((el, index2) =>{
                    let amount_ = Number(res2[1][index2].amount);
                    let productID_ = Number(res2[1][index2].product_id);
                    mid.push(
                        {
                            amount: amount_,
                            productID: productID_
                        }
                    );
                });
                fin.push(
                    {
                        customerID: customerid, 
                        orderID: orderid,
                        Completed: completed, 
                        products: mid
                    }
                );

                if (index === (results[1].length-1)){
                    res.status(200).end(JSON.stringify(fin));
                }
            });
        });
    })
});



app.post("/regCustomer", function(req, res){
    console.log('eshop.post/regCustomer');

    pool.query(`USE eshop; SELECT * FROM customer WHERE email=\'${req.body.email}\';`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "post/regCustomer select failed"}));
            throw error;
        }        
        if (!results[1].length){    //empty result so customer yet to be created
            pool.query(`USE eshop; INSERT INTO customer (name, email, street, street_number, city, postal_code) 
                VALUES (\'${req.body.name}\', \'${req.body.email}\', \'${req.body.street}\', \'${req.body.street_number}\',\'${req.body.city}\', \'${req.body.postal}\');
                SELECT LAST_INSERT_ID();`, function (error_input, results_input, fields) {
                    if (error_input) {
                        res.status(500).end(JSON.stringify({"Status" : "post/regCustomer insert failed"}));
                        throw error;
                    }
                    res.header({
                        'Content-type': 'application/json',
                        'Status': 'New customer created',
                    });
                    console.log('Customer created with id: ' + results_input[results_input.length - 1][0]['LAST_INSERT_ID()']);
                    res.status(200).end(JSON.stringify(
                        {
                            id: results_input[results_input.length - 1][0]['LAST_INSERT_ID()'], 
                        }
                    ));
                }   
            )
        }else{                      //customer already created
            res.header({
                'Content-type': 'application/json',
                'Status': 'Customer already created',
            });
            console.log('Customer already created with id: ' + results[1][0]['id']);
            res.status(200).end(JSON.stringify(
                {
                    id: results[1][0]['id'], 
                }
            ));
        }
    })
});


app.post("/createOrder", function(req, res){
    console.log('eshop.post/createOrder');

    let custome_j = Number(req.body.customer);

    pool.query(`USE \`eshop\`; INSERT INTO \`order\` (\`customer_id\`, \`completed\`) VALUES (${custome_j}, 'false'); SELECT LAST_INSERT_ID();`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "post/createOrder insert failed"}));
            throw error;
        }
        res.header({
            'Content-type': 'application/json',
            'Status': 'New order created',
        });
        console.log('order created with id: ' + results[results.length - 1][0]['LAST_INSERT_ID()']);
        res.status(200).end(JSON.stringify(
            {
                id: results[results.length - 1][0]['LAST_INSERT_ID()'], 
            }
        ));
    })
});


app.post("/insertToOrder", function(req, res){
    console.log('eshop.post/insertToOrder');

    req.body['items'].forEach((el, index) =>{
        let product_id_item = el[0];
        let count_item = el[1];

        pool.query(`USE \`eshop\`; INSERT INTO \`order_product\` (\`amount\`, \`order_id\`, \`product_id\`) VALUES (${count_item}, ${req.body['orderid']}, ${product_id_item});`, function (error, results, fields) {
            if (error) {
                res.status(500).end(JSON.stringify({"Status" : "post/insertToOrder insert failed"}));
                throw error;
            }
        });
    });

    res.header({
        'Content-type': 'application/json',
        'Status': 'Rows added to order_product',
    });
    res.status(200).send(JSON.stringify(
        {
            id: 69
        }
    ));
});


app.post("/counterInc", function(req, res){
    console.log('eshop.post/counterInc');
    let counterB4;
    let newCounter;

    pool.query(`USE eshop; SELECT counter FROM thank_you_page WHERE \`id\` = 1;`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "GET counterInc request failed"}));
            throw error;
        }
        counterB4 = results[1][0]['counter'];
        newCounter = Number(req.body['count']) + Number(counterB4);
    
        pool.query(`USE \`eshop\`; UPDATE \`thank_you_page\` SET \`counter\` = ${newCounter} WHERE \`id\` = 1;`, function (error, results, fields) {
            if (error) {
                res.status(500).end(JSON.stringify({"Status" : "post/counterInc insert failed"}));
                throw error;
            }
        });
    })

    res.header({
        'Content-type': 'application/json',
        'Status': 'Counter incremented',
    });
    res.status(200).send(JSON.stringify(
        {
            count: newCounter,
        }
    ));
});


app.post("/completeOrder", function(req, res){
    console.log('eshop.post/completeOrder');

    let orderid = Number(req.body['orderID']);
    pool.query(`UPDATE \`order\` SET \`completed\` = \'true\' WHERE \`id\` = ${orderid};`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "GET completeOrder request failed"}));
            throw error;
        }
    })
    res.header({
        'Content-type': 'application/json',
        'Status': 'Order completed',
    });
    res.status(200).send(JSON.stringify(
        {
            "Status" : "Order completed"
        }
    ));
});

app.post("/changeTYP", function(req, res){
    console.log('eshop.post/changeTYP');

    let orderid = Number(req.body['orderID']);
    pool.query(`UPDATE \`thank_you_page\` SET \`link\` = '${req.body.newLink}', \`image\` = '${req.body.newImage}' WHERE \`id\` = 1;`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "GET changeTYP request failed"}));
            throw error;
        }
    })
    res.header({
        'Content-type': 'application/json',
        'Status': 'Thank you page changed',
    });
    res.status(200).send(JSON.stringify(
        {
            "Status" : "thank you page changed"
        }
    ));
});

app.post("/resetCounter", function(req, res){
    console.log('eshop.post/resetCounter');

    let orderid = Number(req.body['orderID']);
    pool.query(`UPDATE \`thank_you_page\` SET \`counter\` = 0 WHERE \`id\` = 1;`, function (error, results, fields) {
        if (error) {
            res.status(500).end(JSON.stringify({"Status" : "GET resetCounter request failed"}));
            throw error;
        }
    })
    res.header({
        'Content-type': 'application/json',
        'Status': 'Thank you page counter reset',
    });
    res.status(200).send(JSON.stringify(
        {
            "Status" : "thank you page counter reset"
        }
    ));
});

app.get('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/static/index.html'));
});


app.listen(port, () => {
    console.log(`server running at ${port}`)
})