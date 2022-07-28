const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const fs = require("fs");
const express = require("express");
const axios = require("axios");

const connectionInfo = require("./connectionInfo.js").connectionInfo
const getFacturaArray = require("./getFacturaArray").getFacturaArray

const app = express();

const DIRECTORYNAME = "myExcels"
const directoryPath = path.join(__dirname, DIRECTORYNAME);

let currentInvoiceNumber = 22000

let fecha
let year, month, date

if(!fecha){
    year = getFullYear()
    month = getMonth()
    date = getDate()	
}else{
    fecha = fecha.split("/")
    year = fecha[0]
    month = fecha[1]
    date = fecha[2]
}

let authHeader

const startProcess = () => {
    //call software for current invoice number
    getFactura()
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
    axios('https://api.sdelsol.com/login/Autenticar', {
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
    console.log(authHeader)
    axios(`https://jsonplaceholder.typicode.com/posts/1`)

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


const getFactura = () => {

    let sendData = {
        ejercicio: "2022",
        consulta: `SELECT * FROM F_FAC`
    }

    axios('https://api.sdelsol.com/admin/LanzarConsulta', {
            method: 'POST',
            data: sendData,
            headers: authHeader
        })
        .then((res) => {
            currentInvoiceNumber = res.data.resultado[res.data.resultado.length-1][1].dato + 1
            console.log("this is currentInvoiceNumber", currentInvoiceNumber) // el ultimo numero de factura sin el año delante
            insertRegistro(year, "F_FAC", getFacturaArray(currentInvoiceNumber, year, month, date))

        })
        .catch((err) => console.log(err))

}


const insertRegistro = (year, table, registro) => {

    axios('https://api.sdelsol.com/admin/EscribirRegistro', {
            method: 'POST',
            data: {
                ejercicio: year,
                tabla: table,
                registro: registro
            },
            headers: authHeader
        })
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => console.log(err))

}




const buscarPresupuesto = async () => {
    let sendData = {
        ejercicio: "2022",
        consulta: `SELECT * FROM F_PRE`
    }

    presupuesto = await getPresupuesto(sendData)
    return presupuesto.resultado[0]
}