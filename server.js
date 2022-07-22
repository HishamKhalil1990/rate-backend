'use strict'
// environment setup
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL
const NODE_ENV = process.env.NODE_ENV;
// requiering libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const pg = require('pg');
// creating the app
const app = express();
// setup app
app.use(cors());
app.use(bodyParser.json())
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
app.get('/', welcome)
app.get('/get-all-rates', getRates)
app.get('/get-no-rates', getNoRates)
app.post('/save-rate', saveRate)
app.delete('/delete-rates', deleteRate)
app.get('/get-all-user', getUsers)
app.get('/get-user', getUser)
app.post('/save-user', saveUser)
app.put('/update-user', updateUser)
app.delete('/delete-user', deleteUser)

function welcome(req, res) {
    res.send('server is running successfully')
}

function getRates(req, res) {
    const getRates = 'SELECT * FROM formstable';
    client.query(getRates).then(data => {
        res.send(data.rows)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
}

function getNoRates(req, res) {
    const getRates = 'SELECT * FROM formstable';
    client.query(getRates).then(data => {
        res.send({rows : data.rowCount})
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
}

function saveRate(req,res){
    const {warehouse,answers,note,username} = req.body;
    const addRate = 'INSERT INTO formstable (warehouse,answers,note,username) VALUES ($1, $2, $3, $4) RETURNING *';
    const rateInfo = [warehouse,answers,note,username];
    client.query(addRate, rateInfo).then(data => { 
        res.send({msg : 'added'})
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
}

function deleteRate(req,res){
    const {ids} = req.body;
    const length = ids.length
    const arr = []
    const deleteRate = 'DELETE FROM formstable WHERE id = $1'
    ids.forEach(id => {
        client.query(deleteRate,[id]).then(data=>{
            arr.push('added')
            if(arr.length == length){
                res.send({msg:"deleted"});
            }
        }).catch(err => {
            console.log(err)
            arr.push('added')
            if(arr.length == length){
                res.send({msg:"error"});
            }
        });
    })
}

function getUsers(req,res){
    const getUsers = 'SELECT * FROM userstable';
    client.query(getUsers).then(data => {
        res.send(data.rows)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
}

function saveUser(req,res){
    const {username,pass} = req.body;
    const addUser = 'INSERT INTO userstable (username,pass) VALUES ($1, $2) RETURNING *';
    const userInfo = [username,pass];
    client.query(addUser, userInfo).then(data => { 
        res.send({msg : 'added'})
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
}

function updateUser(req,res){
    const {username,newPass} = req.body;
    const updateUser = 'UPDATE userstable SET pass=$1 WHERE username = $2'
    client.query(updateUser,[newPass,username]).then(data=>{
        res.send({msg:"updated"});
    }).catch(err => {
        console.log(err)
    });
}

function deleteUser(req,res){
    const {username} = req.body;
    const deleteUser = 'DELETE FROM userstable WHERE username = $1'
    client.query(deleteUser,[username]).then(data=>{
        res.send({msg:"deleted"});
    }).catch(err => {
        console.log(err)
    });
}

function getUser(req,res){
    const {username} = req.body;
    const getUser = 'SELECT * FROM userstable WHERE username = $1';
    client.query(getUser,[username]).then(data => {
        res.send(data.rows)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
}