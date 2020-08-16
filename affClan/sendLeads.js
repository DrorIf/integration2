const csvReader = require('../csv/readCsvAndPassArray');
const folderName = 'affClan';
let basePath = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/';
let path = basePath + `${folderName}/csvToSend/`;
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
// const page = 'Mart';
// const page = 'emilia';
const d = new Date();
const date = d.getDate();
const month = (d.getMonth() + 1).toString();
const year = d.getFullYear();
path += `leads${date}${month.length > 1 ? month : '0' + month}${year}.csv`;
async function main() {
    const array = await csvReader.getArrayFromCsv(path, ',');
    let form, res, start = 0, end = array.length;
    for (let i = start; i < end; i++) {
        let element = array[i];
        // p(element);
        form = buildForm('facebook', element, 3);
        // form = buildForm('firestore', element, 3);
        options.form = form;
        p(form);
        try {
            res = await rp(options);
            p(res);
            await sleep(Math.floor(Math.random() * 300000));
        } catch (error) {
            console.log('couldnt insert lead - gor error 400');
            console.log(error);
            await sleep(Math.floor(Math.random() * 50000));

        }
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
                'name': element['name'] + ' ' + element['last name'],
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
                'campaign': 'IT-Giovanni',
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
                'extra data': `2nd phone: ${get2ndPhone(element)}`,
                'email': element['email'],
                counter: counter
            };
            break;
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

function getLname(name) {
    let newName = name;
    if (newName.split(' ').length > 2) {
        p('--- --- ---\n',newName);
        let regex = /\s\s+/;
        newName = name.replace(regex, ' ');
        p(newName);
    }
    if (newName.split(' ')[1] !== '' && newName.split(' ')[1] !== null && newName.split(' ')[1] !== undefined ) {
      const index = newName.indexOf(' ');
      return newName.substring(index).trim();
    } else {
      return 'no-Lname';
    }
}

function get2ndPhone(element) {
    let phone = element['numero_di_telefono_(+39)'];
    if (phone === undefined || phone === '') {
        phone = element['numero_di_telefono_+(39)'];
        if (phone === undefined || phone === '') {
            phone = element['phone_number'];
        }
    }
    return phone;
}

main();

