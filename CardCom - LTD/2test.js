const p = console.log;
const csvReader = require('../csv/readCsvAndPassArray');
const csvWriter = require(`../csv/writeToCsv`);

const pathbase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/CardCom - LTD/';
const outputPath = `${pathbase}data/output.csv`;
const finalPath = `${pathbase}data/final.csv`;


async function main() {
    try {
        const finalArray = [];
        let output = await csvReader.getArrayFromCsv(outputPath, ',');
        output.forEach(e => {
            let creationDate = new Date(e['תאריך']);
            let endDate = new Date(creationDate);
            let numOfPaymnets = Number(e['מספר תשלומים']);
            let totalPay = Number(e['סכום'].replace(',', ''));
            let sumPerInvoice = Number(e['סכום תשלום ראשון'].replace(',', ''));
            let numOfUpcomingInvoices = 0;
            endDate.setMonth(creationDate.getMonth() + (numOfPaymnets - 1));
            let today = new Date();
            let paidPayments = 0;
            let paymentsDates = [];

            if (today <= endDate ) {
                // if this month we have an invoice already or not
                paidPayments = -(creationDate.getMonth() - today.getMonth());
                if (today.getDate() >= creationDate.getDate()) {
                    // we should have , so ++ to num of paid payments;
                    paidPayments++;
                }
                numOfUpcomingInvoices = numOfPaymnets - paidPayments;
                if (numOfUpcomingInvoices === 1) {
                    paymentsDates.push(endDate);
                } else {
                    for (let i = 0; i < numOfUpcomingInvoices; i++) {
                        let d = new Date(endDate);
                        if (i !== 0) {
                            const month = Number(endDate.getMonth()) - i;
                            // p('month: ', month);
                            d.setMonth(d.getMonth() - i);
                            // p('d.getMonth(): ', d.getMonth());
                            // let test = d;
                            // p('d.getMonth(), after sub -1: ', d.getMonth());
                            while (d.getMonth() !== month) {
                                // p('changing');
                                d.setDate(d.getDate() - 1);
                                // p('d.getMonth(), after while: ', d.getMonth());
                            }
                        }
                        let invoiceDate = d;
                        paymentsDates.push(invoiceDate);
                    }
                }
            } else {
                numOfUpcomingInvoices = 0;
                paidPayments = numOfPaymnets;
            }
            p('--- --- --- --- --- --- --- --- ---');
            p('Doc number: ', e['מס מסמך']);
            p('Client ID: ', e['ID']);
            p('Total sum: ', totalPay);
            p('First Payment Date: ', creationDate.toLocaleString());
            p('Number of Payments: ', numOfPaymnets);
            p('Number of Paid payments: ', paidPayments);
            p('Sum per Invoice: ', sumPerInvoice);
            p('Payments left: ', numOfUpcomingInvoices);
            p('Last Payment Date: ', endDate.toLocaleString());
            p('Dates to set invoice: ', paymentsDates);
            paymentsDates.forEach(date => {
                let object = {
                    clientId: e['ID'],
                    'docNumber-Kabala': e['מס מסמך'],
                    'total-Order-Sum': totalPay,
                    'this-Invoice-Sum': sumPerInvoice,
                    'this-Invoice-Date': date.toLocaleString().split(',')[0],
                    'this-Invoice-Date2': date.valueOf(),
                    'last-Invoice-Date': endDate.toLocaleString().split(',')[0],
                    'card-Owener-Name': e['שם בעל הכרטיס'],
                    'client-Name': e['שם לקוח'],
                    'client-Email': e['דואר אלקטרוני']
                };
                finalArray.push(object);
            });

            // p('-- -- -- -- --\ncreationDate: ', creationDate);
            // p('today: ', today);
            // p('endDate: ', endDate);
            
        });
        await saveToCSV(finalArray, finalPath);
    } catch (error) {
        p(error);
    }

}

main();


async function saveToCSV(array, path) {
    try {
      const wrRes = await csvWriter.writeDataToCsv(array, path);
      p(wrRes);
    } catch (error) {
      p(error);
    }
}