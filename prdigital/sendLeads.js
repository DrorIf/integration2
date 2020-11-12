const csvReader = require('../csv/readCsvAndPassArray');
const folderName = 'prdigital';
let path = `/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/${folderName}/csvToSend/`;
const rp = require('request-promise');
const p = console.log;
// const url = 'https://qmdlwkzfbg.execute-api.eu-west-1.amazonaws.com/default/italyFilter';
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
// path += `leads${date}${month.length > 1 ? month : '0' + month}${year}.csv`;
path += `FRleads.csv`;
path = '/Users/drorifrah/Documents/Projects/integration-tests-master/prdigital/csvToSend/FRleads.csv';
p(path);
async function main() {
    const array = await csvReader.getArrayFromCsv(path, ',');
    let form, res;
    // p(array);
    // let start = array.length - 2, end = array.length - 1;
    // let type = 'firestore';
    let type = 'fr-table';
    // let type = 'facebook-it';
    // let type = 'facebook';
    let start = 1, end = array.length;
    for (let i = start; i < end; i++) {
        let element = array[i];
        // p(Object.keys(element));
        form = buildForm(type, element, 1);
        options.form = form;
        p(form);
        res = await rp(options);
        p(res);
        // await sleep(Math.floor(Math.random() * 350000));
    }
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function buildForm(source, element, counter) {
    switch(source) {
        case 'firestore': {
            let exData =  getExDataFromFireStore(element);
            return {
                'name': element['name'].trim() + ' ' + element['last name'].trim(),
                'campaign': element['source'],
                'banner info': `campagin=${exData['campagin']} | adset=${exData['adset']} | ad=${exData['ad']}`,
                'phone':  element['phone'],
                'extra data': `2nd phone: ${exData['2nd phone']}`,
                'email': element['email'],
                counter: counter
            };
            break;
        };

        case 'facebook-it' : {
            return {
                'name': element['nome_e_cognome'],
                'campaign': element['campaign_name'],
                'banner info': `campagin=${element['campaign_name']} | adset=${element['adset_name']} | ad=${element['ad_name']}`,
                'phone':  element['numero_di_telefono'].replace('p:', ''),
                'extra data': `2nd phone: ${element['_numero_di_telefono_(+39)']}`,
                'email': element['e-mail'],
                counter: counter
            };
            break;
        }
        case 'facebook' : {
            return {
                'name': element['full_name'],
                'campaign': element['campaign_name'],
                'banner info': `campagin=${element['campaign_name']} | adset=${element['adset_name']} | ad=${element['ad_name']}`,
                'phone':  getPhoneFacebookCSV(element),
                'extra data': `2nd phone: ${element['numero_di_telefono_(+39)']}`,
                'email': element['email'],
                counter: counter
            };
            break;
        }
        case 'fr-table' : {
            return {
                'name': element['name'],
                'campaign': element['campaign name '],
                'banner info': element['Extra data'],
                'phone':  element['phone '],
                'extra data': element['Extra data'].split('|')[2],
                'email': element['mail'],
            }
        }
    }
}

function getExDataFromFireStore(element) {
    try {
        let exData = JSON.parse(element['extra data']);
        let ex1 = exData['1'];
        let ex2 = exData['2'];
        let result = {};
        result['campagin'] = (ex1.split('|')[0]).split('=')[1];
        result['adset'] = (ex1.split('|')[1]).split('=')[1];
        result['ad'] = (ex1.split('|')[2]).split('=')[1];
        result['2nd phone'] = ex2.split(':')[1];
        return result;
    } catch (error) {
        return {
            campagin: 'unknowen',
            adset: 'unknowen',
            ad: 'unknowen', 
            '2nd phone': 'unknowen'
        };
    }
}

function getPhoneFacebookCSV(element) {
    if (element['phone_number'].includes('p:')) {
        return element['phone_number'].replace('p:', '');
    } else {
        return element['phone_number'];
    }
}

main();

