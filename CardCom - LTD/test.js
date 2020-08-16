const p = console.log;
const csvReader = require('../csv/readCsvAndPassArray');
const csvWriter = require(`../csv/writeToCsv`);

const pathbase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/CardCom - LTD/';
const transPath = `${pathbase}data/trans.csv`;
const dealsPath = `${pathbase}data/deals.csv`;
const receiptsPath = `${pathbase}data/receipts.csv`;
const autoPath = `${pathbase}data/auto.csv`;
const csvPath = `${pathbase}data/output.csv`;
let firstDate = new Date(2019, 2, 24);
// p(firstDate);
// const transPath = `${pathbase}data/trans.csv`;
async function main() {
    try {
        let trans = await csvReader.getArrayFromCsv(transPath, ',');
        let paymnetsTransOnly = trans.filter((e => e['מספר תשלומים'] > 1));
        let needAutoInvoice = paymnetsTransOnly.filter(filterByDateandPayment);
        // p('trans:', trans.length);
        // p('paymnetsTransOnly:', paymnetsTransOnly.length);
        p('needAutoInvoice:', needAutoInvoice.length);
        // p('needAutoInvoice[0]:', needAutoInvoice[0]);
        p('-- -- -- -- -- -- -- -- -- -- -- -- -- -- --');
        
        
        let deals = await csvReader.getArrayFromCsv(dealsPath, ',');
        p('deals:', deals.length);
        // let autoInvoiceIndex = findByCardHolderName(deals[0], needAutoInvoice);
        // p('deals[0]:', deals[0]);
        // p('autoInvoiceIndex:', autoInvoiceIndex);
        // if (autoInvoiceIndex !== -1) {
        //     p(needAutoInvoice[autoInvoiceIndex]);
        // }
        p('-- -- -- -- -- -- -- -- -- -- -- -- -- -- --');

        
        let receipts = await csvReader.getArrayFromCsv(receiptsPath, ',');
        // p('receipts[0]:', receipts[0]);
        p('receipts:', receipts.length);
        p('-- -- -- -- -- -- -- -- -- -- -- -- -- -- --');
        
        
        let auto = await csvReader.getArrayFromCsv(autoPath, ',');
        p('auto:', auto.length);
        p('-- -- -- -- -- -- -- -- -- -- -- -- -- -- --');
        // p('auto[0]:', auto[0]);

        let mapper = [], minimap = {};
        for (let i = 0 ; i < auto.length; i ++) {
            minimap['auto'] = i;
            let receiptsIndex = findByDocNumber(auto[i], receipts);
            minimap['receipt'] = receiptsIndex;
            // p('receiptsIndex:', receiptsIndex);
            // if (receiptsIndex !== -1) {
            //     p(receipts[receiptsIndex]);
            // }
            let dealsIndex = findByID(receipts[receiptsIndex], deals);
            minimap['deal'] = dealsIndex;
            // p('dealsIndex:', dealsIndex);
            // if (dealsIndex !== -1) {
            //     p(deals[dealsIndex]);
            // }
            let needAutoIndex = findByCardHolderName(deals[dealsIndex], needAutoInvoice);
            minimap['trans'] = needAutoIndex;
            // p('needAutoIndex:', needAutoIndex);
            // if(needAutoIndex !== -1) {
            //     p(needAutoInvoice[needAutoIndex]);
            // }
            mapper.push(minimap);
            minimap = {};
        }
        p(mapper);
        const csvArr = [];
        let csvObject = {};
        mapper.forEach(e => {
            csvObject = jsonConcat(csvObject, auto[e['auto']]);
            csvObject = jsonConcat(csvObject, receipts[e['receipt']]);
            csvObject = jsonConcat(csvObject, deals[e['deal']]);
            csvObject = jsonConcat(csvObject, needAutoInvoice[e['trans']]);
            csvArr.push(csvObject);
            csvObject = {};
        });
        await saveToCSV(csvArr, csvPath);
    } catch (error) {
        p(error);
    }

}

// main();

// let d = new Date('2019/04/02');
// let num = 8;
// p('d:', d);
// d.setMonth(d.getMonth() + (num - 1));
// p('d+7:', d);



function filterByDateandPayment(e) {
    let creationDate = new Date(e['תאריך']);
    let endDate = new Date(creationDate);
    let numOfPaymnets = Number(e['מספר תשלומים']);
    endDate.setMonth(creationDate.getMonth() + (numOfPaymnets - 1));
    let today = new Date();
    // p('-- -- -- -- --\ncreationDate: ', creationDate);
    // p('today: ', today);
    // p('endDate: ', endDate);
    if (today <= endDate /*&& creationDate > firstDate*/) {
        return true;
    } else {
        return false;
    }
            
}

function findByCardHolderName(element, searchArr) {
    for(let i = 0; i < searchArr.length; i++) {
        if (element['שם בעל הכרטיס'] === searchArr[i]['שם בעל הכרטיס']) {
            return searchArr.indexOf(searchArr[i]);
        }
    }
    return -1;
}
function findByID(element, searchArr) {
    let results = [], sum = Number(element['סה"כ שקל']), final = -1;
    for(let i = 0; i < searchArr.length; i++) {
        if (element['ID'] === searchArr[i]['ID']) {
            results.push(searchArr.indexOf(searchArr[i]));
        }
    }
    if (results.length === 1) return results[0];
    if (results.length > 1) {
        results.forEach(index => {
            let searchSumIndex = Number(searchArr[index]['סכום'].replace(',', ''));
            if (sum === searchSumIndex) {
                final = index;
            }
        });
    }

    return final;
}
function findByDocNumber(element, searchArr) {
    for(let i = 0; i < searchArr.length; i++) {
        if (element['מס מסמך'] === searchArr[i]['מס מסמך']) {
            return searchArr.indexOf(searchArr[i]);
        }
    }
    return -1;
}

function jsonConcat(o1, o2) {
    for (var key in o2) {
     o1[key] = o2[key];
    }
    return o1;
}

async function saveToCSV(array, path) {
    try {
      const wrRes = await csvWriter.writeDataToCsv(array, path);
      p(wrRes);
    } catch (error) {
      p(error);
    }
}

// let hourStr = '14:00:00.000Z';
// let str = '14/03/2019';
// let split = str.split('/');
// let dateStr = `${split[2]}-${split[1]}-${split[0]}`  + 'T' + hourStr;
// let date = new Date(dateStr);
// p(`date: `, date);
// p('date.getDate:', date.getDate());
let today = new Date('2019-03-30T22:00:00.000Z');
p(today.toLocaleString());
today.setMonth(today.getMonth() - 1);
const month = today.getMonth();

while (today.getMonth() === month) {
    today.setDate(today.getDate() - 1);
}
p(today.toLocaleString());
// let todayWithDate = new Date();
// todayWithDate.setDate(date.getDate());
// p('today: ', today);
// p('todayWithDate: ', todayWithDate);
// p('date month + 9:', date.getMonth() + 9);
// date.setMonth(date.getMonth() + 9);
// p(`date after add: `, date);

