const csvReader = require('../csv/readCsvAndPassArray');
const folderName = 'digitalboost';
let path = `/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/${folderName}/csvToSend/`;
const rp = require('request-promise');
const p = console.log;
const url = 'https://kgw3lewmx2.execute-api.eu-west-1.amazonaws.com/dev/soar-fx';

const options = {
    method: 'POST',
    uri: url,
    form: {},
    headers: {},
    json: true
};
// const d = new Date();
// const date = d.getDate();
// const month = (d.getMonth() + 1).toString();
// const year = d.getFullYear();
// path += `leads${date}${month.length > 1 ? month : '0' + month}${year}.csv`;
// path += `leads.csv`;
// path += `form-08-07.csv`;
// path += `upgraded-13-07.csv`;
path += `website.csv`;
p(path);
async function main() {
    const array = await csvReader.getArrayFromCsv(path, ',');
    let form, res;
    // p(array);
    // let start = array.length - 2, end = array.length - 1;
    let type = 'facebook';
    let start = 0, end = array.length;
    for (let i = start; i < end; i++) {
        let element = array[i];
        form = buildForm(type, element);
        options.form = form;
        p(form);
        res = await rp(options);
        p(res);
        await sleep(Math.floor(Math.random() * 350));
    }
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function buildForm(source, element) {
    switch(source) {
        case 'facebook' : {
            return {
                'mediaSource': 'instagram',
                'name': element['full_name'],
                'campaign': element['campaign_name'],
                'ad':  element['ad_name'],
                'adset':  element['adset_name'],
                'phone':  getPhoneFacebookCSV(element),
                // 'phone':  getPhoneFacebookCSV(element, 1),
                'extra data': `2nd phone: 0${element['מספר_טלפון_עדכני']}`,
                'email': element['email'],
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

function getPhoneFacebookCSV(element, flag) {
    if (flag) {
        return `0${element['מספר_טלפון_עדכני']}`;
    }
    let newPhone = '';
    if (element['phone_number'].includes('p:')) {
        newPhone = element['phone_number'].replace('p:', '');
    } else {
        newPhone = element['phone_number'];
    }
    if (newPhone.includes('+972')) {
        return newPhone.replace('+972', '0');
    } else {
        return newPhone;
    }
}

main();

