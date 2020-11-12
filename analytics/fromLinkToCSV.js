p = console.log;
const globalparams  = require('../globalparams.json');
let location = {} 
const csvReader = require('../csv/readCsvAndPassArray');
const csvWriter = require('../CSV/writeToCsv');
const folderName = 'analytics';
let fileName = 'leads.csv';
let path = `${globalparams.basePath}/${folderName}/${fileName}`;

async function main() {
    const array = await csvReader.getArrayFromCsv(path, ',');
    let form, start = 0, end = array.length, arrayForms = [];
    for (let i = start; i < end; i++) {
        form = {};
        let row = array[i].link;
        row = row.substr(15);
        if(row[0] === '?') row = row.substr(1);
        p(row);
        form = Object.fromEntries(new URLSearchParams(row));
        p(form);
        arrayForms.push(form);
    }
    fileName = 'leads-orderd.csv';
    path = `${globalparams.basePath}/${folderName}/${fileName}`;
    try {
        const wrRes = await csvWriter.writeDataToCsv(arrayForms, path);
        p(wrRes);
    } catch (error) {
        p(error);
    }
}


main();
