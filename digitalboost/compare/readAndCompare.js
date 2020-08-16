const csvReader = require('/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/csv/readCsvAndPassArray.js');
const pathCardCom = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/digitalboost/compare/LPDReport.csv';
const pathSales = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/digitalboost/compare/Sales.csv';
const p = console.log;
async function main() {
    let arrayCardCom, arraySales, flag = 0;;
    try {
        arrayCardCom = await csvReader.getArrayFromCsv(pathCardCom, ',');
        arraySales = await csvReader.getArrayFromCsv(pathSales, ',');
        flag = 1;
    } catch (error) {
        p('error on try catch main: ', error);
    }
    if (flag) {
        p('array1: ', arrayCardCom.length);
        p('array1: ', arraySales.length);
        p('\n')
        // p(`cardCom dats: `);
        // for (let i = 0; i < 5; i++) {
        //     p(`#${i+1}: `, new Date(arrayCardCom[i]['תאריך יצירה']));
        // }
        // p(`Sales dats: `);
        // for (let i = 0; i < 5; i++) {
        //     p(`#${i+1}: `, new Date(arraySales[i]['נוצר בתאריך']));
        // }

        p('.\nsorting Sales array.. .. .. ..\n.');
        arraySales.sort((a, b) => {
            let x = new Date(a['נוצר בתאריך']);
            let y = new Date(b['נוצר בתאריך']);
            if (x < y) {return -1}
            if (x > y) {return 1}
            if (x === y) {return 0}
        });
        arrayCardCom.sort((a, b) => {
            let x = new Date(a['תאריך יצירה']);
            let y = new Date(b['תאריך יצירה']);
            if (x < y) {return -1}
            if (x > y) {return 1}
            if (x === y) {return 0}
        });

        p(`cardCom dats: `);
        for (let i = 0; i < arrayCardCom.length; i++) {
            // p('date: ', arrayCardCom[i]['תאריך יצירה']);
            let x = arrayCardCom[i]['תאריך יצירה'];
            let split1 = x.split(' ');
            let date = split1[0];
            let time = split1[1];
            let splitDate = date.split('/');
            let splitTime = time.split(':');
            let year = splitDate[2], month = Number(splitDate[1]) - 1, day = splitDate[0];
            let hour = splitTime[0], min = splitTime[1];
            // p(`${year}-${month + 1}-${day},${hour}:${min}`);
            let d = new Date(year, month, day, hour, min);
            // p(d);
            p(`#${i+1}: `, d);
        }
        // p(`Sales dats: `);
        // for (let i = 0; i < arraySales.length; i++) {
        //     p(`#${i+1}: `, new Date(arraySales[i]['נוצר בתאריך']));
        // }
        let a1 = arrayCardCom[arrayCardCom.length - 1]['תאריך יצירה'];//.split(' ')[0];
        let a2 = arraySales[arraySales.length - 1]['נוצר בתאריך'];//.split(',')[0];
        p('\n\na1: ', a1);
        p('a2: ', a2);
        let d1 = new Date(a1).valueOf();
        let d2 = new Date(a2).valueOf();
        p('\n\nd1: ', d1);
        p('d2: ', d2);
        p(d1 > d2);

    }
}

main();