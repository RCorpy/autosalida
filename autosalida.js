const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const fs = require("fs");
const express = require("express");
const axios = require("axios");

const connectionInfo = require("./connectionInfo.js").connectionInfo

const app = express();

const DIRECTORYNAME = "myExcels"
const directoryPath = path.join(__dirname, DIRECTORYNAME);

let currentInvoiceNumber = 22000

let authHeader

const startProcess = () => {
    //call software for current invoice number
    apiCall()
}

const readExcels = () => {

    fs.readdir(directoryPath, function (err, excels) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all excels using forEach
        excels.forEach((excel) => {
            //write invoiceNumber in excel and increment
            //get data for software
            //upload data to software
            //make excel into pdf
            //send email with pdf to client
            console.log(excel)
        })
    });

}



const apiAuth = () => {
    const response = axios('https://api.sdelsol.com/login/Autenticar', {
            method: 'POST',
            data: connectionInfo
        })
        .then((res) => {
            authHeader = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${res.data.resultado}`
            }
            startProcess()
        })
        .catch((err) => console.log(err))

}


apiAuth()

//startProcess()




const apiCall = () => {
    axios
        .get(`https://jsonplaceholder.typicode.com/posts/1`)

        // Print data
        .then((response) => {
            const {
                id,
                title
            } = response.data;
            console.log(`Post ${id}: ${title}\n`);
            readExcels()
        })
        .catch((error) => console.log("Error to fetch data\n", error));
}