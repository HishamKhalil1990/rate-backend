'use strict'
// environment setup
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL
const NODE_ENV = process.env.NODE_ENV;
// requiering libraries
const express = require('express');
const cors = require('cors');
const pg = require('pg');
// creating the app
const app = express();
// setup app
app.use(cors());
// creating psql client
const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL };
const client = new pg.Client(process.env.DATABASE_URL);
// check client connection
client.on('error', error => { throw error; })
client.connect().then(() => {
    // listen to the port
    app.listen(PORT, () => {
        console.log('we are listening to port 3000')
    })
}).catch(error => {
    console.log("client connction faild",error);
})
// app middleware
app.get('/get-all-rates', getRates)
app.get('/get-no-rates', getNoRates)
app.post('/save-rate', saveRate)
app.delete('/delete-rate/id', deleteRate)
app.get('/get-all-user', getUsers)
app.get('/get-user', getUser)
app.post('/save-user', saveUser)
app.put('/update-user', updateUser)
app.delete('/delete-user/id', deleteUser)

function getRates(req, res) {
    const getItems = 'SELECT * FROM formstable';
    client.query(getItems).then(data => {
        res.send(data.rows)
    });
}

function getNoRates(req, res) {
    const getItems = 'SELECT * FROM formstable';
    client.query(getItems).then(data => {
        res.send(data.rows)
    });
}

function saveRate(req,res){
    
}

function deleteRate(req,res){

}

function getUsers(req,res){

}

function saveUser(req,res){

}

function updateUser(req,res){

}

function deleteUser(req,res){

}

function getUser(req,res){

}