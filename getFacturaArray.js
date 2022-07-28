const getFacturaArray = (currentInvoiceNumber, year, month, date) => {

    function toMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
      
        return date.toLocaleString('en-US', {
          month: 'long',
        });
      }

    let descuento = 50
    let portes = 17
    let netoFactura = 10
    let descuentoFactura = netoFactura*(descuento/100)
    let baseFactura = descuentoFactura+portes
    let ivaFact = baseFactura*0.21
    let totalFact = baseFactura + ivaFact


    let stringYear = year.toString()
    let factura = [{
            "columna": "TIPFAC",
            "dato": 1
        },
        {
            "columna": "CODFAC",
            "dato": currentInvoiceNumber
        },
        {
            "columna": "REFFAC",
            "dato": `${stringYear[2]}${stringYear[3]}${"0".repeat(Math.floor(currentInvoiceNumber/10)==0 ? 2 : Math.floor(currentInvoiceNumber/10)<10 ? 1 : 0)}${currentInvoiceNumber}`
        },
        {
            "columna": "FECFAC",
            "dato":`${date}-${toMonthName(month)}-${year}`
        },
        {
            "columna": "CLIFAC", //CNOFAC   CDOFAC  CPOFAC  CCPFAC  CPRFAC  CNIFAC  TIVFAC  REQFAC  TELFAC CEMFAC
            "dato": 1
        },
        {
            "columna": "NET1FAC",
            "dato": netoFactura
        },
        {
            "columna": "IDTO1FAC", //IDTO1FAC <-- solo vale este, habra que calcularlo y ponerlo
            "dato": descuentoFactura
        },
        {
            "columna": "IPOR1FAC",
            "dato": portes
        },
        {
            "columna": "FOPFAC",
            "dato": "CON"
        }, //PRTFAC y VENFAC
        {
            "columna": "PIVA1FAC",
            "dato": 21
        },
        {
            "columna": "PIVA2FAC",
            "dato": 10
        },
        {
            "columna": "PIVA3FAC",
            "dato": 4
        },
        {
            "columna": "ALMFAC",
            "dato": "GEN"
        },
        {
            "columna": "BAS1FAC", //dato calculado
            "dato": baseFactura
        },
        {
            "columna": "IIVA1FAC", //dato calculado
            "dato": ivaFact
        },
        {
            "columna": "PREC1FAC",
            "dato": 5.2
        },
        {
            "columna": "PREC2FAC",
            "dato": 1.4
        },
        {
            "columna": "PREC3FAC",
            "dato": 0.5
        },
        {
            "columna": "VENFAC",
            "dato": `${date}/${month}/${year}`
        },
        {
            "columna": "IMPFAC",
            "dato": "N"
        },
        {
            "columna": "TIVA2FAC",
            "dato": 1
        },
        {
            "columna": "TIVA3FAC",
            "dato": 2
        },
        {
            "columna": "EDRFAC",
            "dato": year
        },
        {
            "columna": "BCOFAC",
            "dato": 1
        },
        {
            "columna": "TOTFAC",
            "dato": totalFact
        },
    ]

    return factura
}


module.exports = {
    getFacturaArray: getFacturaArray
}