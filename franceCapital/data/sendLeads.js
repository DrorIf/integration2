const csvReader = require('../csv/readCsvAndPassArray');
const pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/';
let path = pathBase + 'franceCapital/csvToSend/';
const rp = require('request-promise');
const p = console.log;
const url = 'https://qmdlwkzfbg.execute-api.eu-west-1.amazonaws.com/default/italyFilter';
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
path += `leads${date}${month.length > 1 ? month : '0' + month}${year}.csv`;
console.log(path);
async function main() {
    const array = await csvReader.getArrayFromCsv(path, ',');
    let form, res;
    for ( let i = 0; i < array.length; i++) {
        let element = array[i];
        console.log(element);
        console.log(element['extra data']);
        console.log(typeof(element['extra data']));
        form = buildForm('firestore', element);
        options.form = form;
        // p(form);
        // res = await rp(options);
        // p(res);
        // await sleep(450000);
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
                'banner info': `campagin=${exData['campagin']} | adset=${exData['adset']} | ad=${exData['ad']}`,
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
                'banner info': `campagin=${element['campaign_name']} | adset=${element['adset_name']} | ad=${element['ad_name']}`,
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

