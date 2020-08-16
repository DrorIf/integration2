const csvReader = require('../csv/readCsvAndPassArray');
const pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/';
let path = pathBase + 'franceCapital/csvToSend/';
const rp = require('request-promise');
const p = console.log;
const url = 'https://egthhvddc4.execute-api.eu-west-1.amazonaws.com/default/frenchFilter';
const options = {
    method: 'POST',
    uri: url,
    form: {},
    headers: {},
    json: true
};
const d = new Date();
const date = d.getDate();
const month = (d.getMonth() + 1).toString();
const year = d.getFullYear();
path += `FRleads${date}${month.length > 1 ? month : '0' + month}${year}.csv`;
// console.log(path);
async function main() {
    const array = await csvReader.getArrayFromCsv(path, ',');
    let form, res;
    for ( let i = 42; i < array.length; i++) {
        let element = array[i];
        // console.log(element);
        form = buildForm('firestore', element);
        options.form = form;
        p(form);
        res = await rp(options);
        p(res);
        // await sleep(4500);
    }
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function buildForm(source, element) {
    switch(source) {
        case 'firestore': {
            let exData =  getExDataFromFireStore(element);
            return {
                'name': element['name'],
                'campaign': element['source'],
                'banner info': element['extra data'],
                'phone':  element['phone'],
                'extra data': `2nd phone: ${exData['2nd phone']}`,
                'email': element['email'],
            };
            break;
        };

        case 'facebook' : {
            return {
                'name': element['nome_e_cognome'],
                'campaign': 'IT-Giovanni',
                'banner info': element['extra data'],
                'phone':  element['numero_di_telefono'].replace('p:', ''),
                'extra data': `2nd phone: ${element['_numero_di_telefono_(+39)']}`,
                'email': element['e-mail'],
            };
            break;
        }
    }
}

function getExDataFromFireStore(element) {
    try {
        
        let result = element['extra data'].split('|');
        return result;
    } catch (error) {
        return '';
    }
}
main();

