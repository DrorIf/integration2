const getLeads = require('/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/vikingsNetwork/getLeads.js');
const getFTDs = require('/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/vikingsNetwork/getFTDs.js');
const rp = require('request-promise');
const d = new Date();
const options = {
    method: 'POST',
    uri: `https://hooks.zapier.com/hooks/catch/2261684/otjo8vh/`,
    form: {
        FTD: 0,
        date: ''
    },
    headers: {},
    json: true
};
async function main() {
    let ftds = await getFTDs.main();
    console.log('in getData main: res,', ftds.length);
    options.form.FTD = ftds.length;
    options.form.date = d;
    rp(options).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
    getLeads.main();
}

main();