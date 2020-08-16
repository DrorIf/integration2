const rp = require('request-promise');
const url = 'http://leads.expand-credit.com/Get_Leads_Status_json';
const csvWriter = require('../CSV/writeToCsv');
const pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/';
const path = pathBase + 'amirLoans/data/report.csv';
const p = console.log;

const form = {
    // 'Marketing Platform ID Str': 'GrF43Bdqpm54poeQWyTrevcfde3421YHGfU76NO'
    'Marketing Platform ID Str': 'דרור לידים משכנתאות',
    'From Date': '01/03/2020',
    'Client Additiional Field': 'Spare ExtFld 03',
    'Bad Client Additiional Field': 'Spare ExtFld 03'
};
const options = {
    method: 'POST',
    uri: url, 
    form: form,
    json: true,
    headers: {}
};

// rp(options).then(res => {
//     console.log('Success');
//     console.log(res);
// }).catch(err => {
//     console.log('Errored');
//     console.log(err);
// });

async function main() {
    try {
        let response = await rp(options);
        p(response);
        response = Object.values(response.Data);
        // p(response.length);
        // p(Object.keys(response));
        const wrRes = await csvWriter.writeDataToCsv(response, path);
        p('done, wRes: ', wrRes);
    } catch (error) {
        p('Errored: ', error);
    }
}


main();