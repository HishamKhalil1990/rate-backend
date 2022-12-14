'use strict'
// environment setup
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL
const NODE_ENV = process.env.NODE_ENV;
const SERVICE_URL = process.env.SERVICE_URL
const CONFIRM_PASS = process.env.CONFIRM_PASS
// requiering libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const axios = require('axios')
const pg = require('pg');
// import routes
const maltrans = require('./routes/maltrans')
// creating the app
const app = express();
// setup app
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}))
app.use('/maltrans',maltrans)
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
app.get('/fetch-all-rates', fetchRates)
app.get('/get-no-rates', getNoRates)
app.post('/save-rate', saveRate)
app.delete('/delete-rates', deleteRate)
app.get('/get-all-user', getUsers)
app.get('/fetch-all-user', fetchUsers)
app.post('/get-user', getUser)
app.post('/save-user', saveUser)
app.put('/update-user', updateUser)
app.delete('/delete-user', deleteUser)
app.get('/supervisor-orders/:cardcode',getSupervisorOrders)
app.get('/get-all-supervisor-user', getSupervisorUsers)
app.get('/fetch-all-supervisor-user', fetchSupervisorUsers)
app.post('/check-supervisor-user', checkSupervisorUser)
app.post('/register-supervisor-user', saveSupervisorUser)
app.put('/update-supervisor-user', updateSupervisorUser)
app.delete('/delete-supervisor-user', deleteSupervisorUser)

//////////////////////// check server is running //////////////////////////////
function welcome(req, res) {
    res.send('server is running successfully')
}

//////////////////////// rates table /////////////////////////////////////////
function getRates(req, res) {
    const getRates = 'SELECT * FROM formstable';
    client.query(getRates).then(data => {
        res.send(data.rows)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
}

function fetchRates(req,res){
    if(NODE_ENV !== 'production'){
        axios({
            baseURL:'https://alrayhan-rate.herokuapp.com',
            url: '/get-all-rates',
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            const records = response.data
            let i = 0
            const start = async() => {
                for(i; i < records.length; i++){
                    const rec = records[i];
                    const data = {
                        warehouse:rec.warehouse,
                        visit:rec.visit,
                        answers:rec.answers,
                        note:rec.note,
                        username:rec.username
                    }
                    await axios({
                        baseURL:`http://localhost:${PORT}`,
                        url: '/save-rate',
                        method: 'post',
                        headers: {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data)
                    }).then((response) => {
                        if(i + 1 == records.length){
                            axios({
                                baseURL:`http://localhost:${PORT}`,
                                url: '/get-all-rates',
                                method: 'get',
                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Content-Type': 'application/json'
                                },
                            }).then(response => {
                                res.send(response.data)
                            })
                        }
                    })
                }
            }
            if(records.length != 0){
                start()
            }else{
                res.send('empty')
            }
        })
    }
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
    const {warehouse,visit,answers,note,username} = req.body;
    const addRate = 'INSERT INTO formstable (warehouse,visit,answers,note,username) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const rateInfo = [warehouse,visit,answers,note,username];
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

//////////////////////// rating users table ////////////////////////////////////
function getUsers(req,res){
    const getUsers = 'SELECT * FROM userstable';
    client.query(getUsers).then(data => {
        res.send(data.rows)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
}

function fetchUsers(req,res){
    if(NODE_ENV !== 'production'){
        axios({
            baseURL:'https://alrayhan-rate.herokuapp.com',
            url: '/get-all-user',
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            const records = response.data
            let i = 0
            const start = async() => {
                for(i; i < records.length; i++){
                    const rec = records[i];
                    const data = {
                        username:rec.username,
                        pass:rec.pass,
                    }
                    await axios({
                        baseURL:`http://localhost:${PORT}`,
                        url: '/save-user',
                        method: 'post',
                        headers: {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data)
                    }).then((response) => {
                        if(i + 1 == records.length){
                            axios({
                                baseURL:`http://localhost:${PORT}`,
                                url: '/get-all-user',
                                method: 'get',
                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Content-Type': 'application/json'
                                },
                            }).then(response => {
                                res.send(response.data)
                            })
                        }
                    })
                }
            }
            if(records.length != 0){
                start()
            }else{
                res.send('empty')
            }
        })
    }
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
        res.send(err)
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

//////////////////////// supervisor users table ////////////////////////////////
async function getSupervisorOrders(req,res){
    const {cardcode} = req.params
    axios.get(`${SERVICE_URL}/supervisor/${cardcode}`,{timeout : 30000})
    .then(orders => {
        res.send({
            msg:"success",
            orders:orders.data
        })
    })
    .catch((err) => {
        res.send({
            msg:"service is shut down"
        })
    })
}

function getSupervisorUsers(req,res){
    const getSupervisorUsers = 'SELECT * FROM supervisorUsertable';
    client.query(getSupervisorUsers).then(data => {
        res.send(data.rows)
    }).catch(err => {
        console.log(err)
        res.send({
            status: 'failed',
            msg:"could not get all supervisor users due to server internal error, please try again"
        })
    });
}

function fetchSupervisorUsers(req,res){
    if(NODE_ENV !== 'production'){
        axios({
            baseURL:'https://alrayhan-rate.herokuapp.com',
            url: '/get-all-supervisor-user',
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            const records = response.data
            let i = 0
            const start = async() => {
                for(i; i < records.length; i++){
                    const rec = records[i];
                    const data = {
                        username:rec.username,
                        password:rec.pass,
                        cardcode:rec.cardcode,
                        confirmPass:CONFIRM_PASS
                    }
                    await axios({
                        baseURL:`http://localhost:${PORT}`,
                        url: '/register-supervisor-user',
                        method: 'post',
                        headers: {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data)
                    }).then((response) => {
                        if(i + 1 == records.length){
                            axios({
                                baseURL:`http://localhost:${PORT}`,
                                url: '/get-all-supervisor-user',
                                method: 'get',
                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Content-Type': 'application/json'
                                },
                            }).then(response => {
                                res.send(response.data)
                            })
                        }
                    })
                }
            }
            if(records.length != 0){
                start()
            }else{
                res.send('empty')
            }
        })
    }
}

function saveSupervisorUser(req,res){
    const {username, password,cardcode,confirmPass} = req.body;
    if(confirmPass == CONFIRM_PASS){
        const getSupervisorUser = 'SELECT * FROM supervisorUsertable WHERE username = $1';
        client.query(getSupervisorUser,[username]).then(data => {
            if(data.rows[0]?.username == username){
                res.send({
                    status: 'failed',
                    msg:"username exists"
                })
            }else{
                const addUser = 'INSERT INTO supervisorUsertable (username,pass,cardcode) VALUES ($1, $2, $3) RETURNING *';
                const userInfo = [username,password,cardcode];
                client.query(addUser, userInfo).then(data => { 
                    res.send({
                        status: 'success',
                    })
                }).catch(err => {
                    console.log(err)
                    res.send({
                        status: 'failed',
                        msg:"could not save supervisor user due to server internal error, please try again"
                    })
                })
            }
        }).catch(err => {
            console.log(err)
            res.send({
                status: 'failed',
                msg:"could not save supervisor user due to server internal error, please try again"
            })
        });
    }else{
        res.send({
            status: 'failed',
            msg:"confirmation password is wrong"
        })
    }
}

function updateSupervisorUser(req,res){
    const {username,newpass,newcode,confirmPass} = req.body;
    let updateSupervisorUser;
    let values;
    if(newpass){
        updateSupervisorUser = 'UPDATE supervisorUsertable SET pass=$1 WHERE username = $2'
        values = [newpass,username]
    }else if(newcode){
        if(confirmPass == CONFIRM_PASS){
            updateSupervisorUser = 'UPDATE supervisorUsertable SET cardcode=$1 WHERE username = $2'
            values = [newcode,username]
        }else{
            res.send({
                status: 'failed',
                msg:"confirmation password is wrong"
            })
        }
    }
    client.query(updateSupervisorUser,values).then(data=>{
        res.send({
            status: 'success',
        });
    }).catch(err => {
        console.log(err)
        res.send({
            status: 'failed',
            msg:"could not update supervisor user due to server internal error, please try again"
        })
    });
}

function deleteSupervisorUser(req,res){
    const {username} = req.body;
    const deleteSupervisorUser = 'DELETE FROM supervisorUsertable WHERE username = $1'
    client.query(deleteSupervisorUser,[username]).then(data=>{
        res.send({
            status: 'success',
        });
    }).catch(err => {
        console.log(err)
        res.send({
            status: 'failed',
            msg:"could not delete supervisor user due to server internal error, please try again"
        })
    });
}

function checkSupervisorUser(req,res){
    const {username,password} = req.body;
    const checkSupervisorUser = 'SELECT * FROM supervisorUsertable WHERE username = $1';
    client.query(checkSupervisorUser,[username]).then(data => {
        if(data.rows.length > 0){
            if(data.rows[0].pass == password){
                res.send({
                    status: 'success',
                    data : {
                        username : data.rows[0].username,
                        cardcode : data.rows[0].cardcode
                    }
                })
            }else{
                res.send({
                    status: 'faild',
                })
            }
        }else{
            res.send({
                status: 'faild',
            })
        }
    }).catch(err => {
        console.log(err)
        res.send({
            status: 'faild',
        })
    });
}