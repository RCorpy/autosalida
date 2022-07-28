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
let authHeader

if(!fecha){
    const d = new Date();
    year = d.getFullYear()
    month = d.getMonth() +1
    date = d.getDate()	
}else{
    fecha = fecha.split("/")
    year = fecha[0]
    month = fecha[1]
    date = fecha[2]
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

const startProcess = () => {
    //call software for current invoice number
    getFactura()
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
            readExcels()
        })
        .catch((err) => console.log(err))

}

const readExcels = () => {

    fs.readdir(directoryPath, function (err, excels) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all excels using forEach
        excels.forEach((excel) => {
            
            //get data for software
            XlsxPopulate.fromFileAsync(path.join(directoryPath, excel))
            .then(workbook => {
                let proformaSheet = workbook.sheet("proforma")
                let facturaSheet = workbook.sheet("factura")

                console.log(proformaSheet.usedRange().value()[51-3]) // -3 (1 por la posicion 0 y 2 por el margen de arriba)
                console.log(proformaSheet.cell("B51").value())
            })
            
            //make excel into pdf
            //send email with pdf to client

            //upload data to software
            insertRegistro(year, "F_FAC", getFacturaArray(currentInvoiceNumber, year, month, date)) // hacer esto para cada factura
            //write invoiceNumber in excel and increment

            currentInvoiceNumber= currentInvoiceNumber+1
        })
    });

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

apiAuth()