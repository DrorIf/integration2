const csvReader = require('./readCsvAndPassArray');
const csvWriter = require('./writeToCsv');
const folderName = 'csv';
const basePath = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/';
const path = basePath + `${folderName}/compare/`;
const p = console.log;

let path1 = path + 'compare1.csv';
let path2 = path + 'compare2.csv';
let pathToSave = path + 'results.csv';


async function main() {
    const array1 = await csvReader.getArrayFromCsv(path1, ',');
    const array2 = await csvReader.getArrayFromCsv(path2, ',');
    const results = [];
    p(`array1 length: ${array1.length}`);
    p(`array2 length: ${array2.length}`);
    let counter = 0;
    let start1 = 0, end1 = array1.length;
    let start2 = 0, end2 = array2.length;
    let element1;
    for (let i = start1; i < end1; i ++) {
        let email1 = getEmail(array1[i]);
        for (let j = start2; j < end2; j++) {
            if (email1 === array2[j]['email']) {
                counter ++;
            }
        }
        if (counter === 0) {
            results.push(array1[i]);
            p(`email1: ${email1}, phone: ${array1[i]['numero_di_telefono']}`);
        }
        counter = 0;
    }
    const wrRes = await csvWriter.writeDataToCsv(results, pathToSave);
    p(wrRes);
    
}

main();

function getEmail(element) {
    if (element['e-mail'].includes('@')) {
        return element['e-mail'];
    } else {
        return element['nome_e_cognome'];
    }
}