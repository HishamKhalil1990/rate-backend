require('dotenv').config()
const axios = require('axios')
const fetch = require('node-fetch');
const FormData = require('form-data')

const SERVICE_URL = process.env.SERVICE_URL

const billOfLadingInfo = async(req,res) => {
    const {billNo} = req.body
    const token = req.token
    axios({
        baseURL:`${SERVICE_URL}`,
        url: '/bill-of-lading',
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify({
            billNo:billNo,
        })
    })
    .then(results => {
        res.send(results.data)
    })
    .catch(err => {
        res.send({
            status: 'faild',
            msg: 'server is shutdown!'
        })
    })
}

const checkMaltransUser = async(req,res) => {
    const {username,password} = req.body;
    axios({
        baseURL:`${SERVICE_URL}`,
        url: '/check-maltrans-user',
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            username:username,
            password:password
        })
    })
    .then(results => {
        res.send(results.data)
    })
    .catch(err => {
        res.send({
            status: 'faild',
            msg: 'server is shutdown!'
        })
    })
}

const saveMaltData = async(req,res) => {
    const data = req.body
    const token = req.token
    const formData = new FormData()
    formData.append('BL', data['BL']);
    formData.append('customCenter', data.customCenter);
    formData.append('clearanceNo', data.clearanceNo);
    formData.append('clearanceDate', data.clearanceDate);
    formData.append('healthPath', data.healthPath);
    formData.append('customPath', data.customPath);
    formData.append('agriPath', data.agriPath);
    formData.append('customeInsurance', data.customeInsurance);
    formData.append('clearanceFinish', data.clearanceFinish);
    formData.append('requiredAction', data.requiredAction);
    formData.append('docDone', data.docDone);
    formData.append('UserName', data.UserName);
    formData.append('FileOneName',data.FileOneName)
    formData.append('FileTwoName',data.FileTwoName)
    formData.append('FileThreeName',data.FileThreeName)
    formData.append('FileFourName',data.FileFourName)
    if(data.FileOneName != ""){
        formData.append('FileOne',data.FileOne)
    }
    if(data.FileTwoName != ""){
        formData.append('FileTwo',data.FileTwo)
    }
    if(data.FileThreeName != ""){
        formData.append('FileThree',data.FileThree)
    }
    if(data.FileFourName != ""){
        formData.append('FileFour',data.FileFour)
    }
    fetch(
        `${SERVICE_URL}/save-maltrans-data`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        }
    )
    .then((response) => response.json())
    .then(results => {
        res.send(results)
    })
    .catch(err => {
        console.log(err)
        res.send({
            status: 'faild',
            msg: 'server is shutdown!'
        })
    })
}

const getContainerInfo = async(req,res) => {
    const data = req.body;
    const token = req.token
    axios({
        baseURL:`${SERVICE_URL}`,
        url: '/get-container-info',
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(data)
    })
    .then(results => {
        res.send(results.data)
    })
    .catch(err => {
        res.send({
            status: 'faild',
            msg: 'server is shutdown!'
        })
    })
}

const saveContainerInfo = async(req,res) => {
    const data = req.body;
    const token = req.token
    axios({
        baseURL:`${SERVICE_URL}`,
        url: '/save-container-info',
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(data)
    })
    .then(results => {
        res.send(results.data)
    })
    .catch(err => {
        res.send({
            status: 'faild',
            msg: 'server is shutdown!'
        })
    })
}

module.exports = {
    billOfLadingInfo,
    checkMaltransUser,
    saveMaltData,
    getContainerInfo,
    saveContainerInfo
}