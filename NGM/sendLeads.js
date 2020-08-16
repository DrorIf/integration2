const csvReader = require('../csv/readCsvAndPassArray');
const path = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/NGM/leadsInsert/leads.csv';
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

async function main() {
    const array = await csvReader.getArrayFromCsv(path, ',');
    let form, res;
    for ( let i = 1; i < array.length; i++) {
        let element = array[i];
        form = {
            'name': element['nome_e_cognome'],
            'campaign': 'IT-Giovanni',
            'banner info': `campagin=${element['campaign_name']} | adset=${element['adset_name']} | ad=${element['ad_name']}`,
            'phone':  element['numero_di_telefono'].replace('p:', ''),
            'extra data': `2nd phone: ${element['_numero_di_telefono_(+39)']}`,
            'email': element['e-mail']
        };
        options.form = form;
        p(options);
        p(JSON.stringify(options));
        res = await rp(options);
        p(res);
        await sleep(45000);
    }
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

main();