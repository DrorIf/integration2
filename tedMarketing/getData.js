const getLeads = require('/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/tedMarketing/getLeads.js');
const getFTDs = require('/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/tedMarketing/getFTDs.js');
const rp = require('request-promise');
const d = new Date();
const options = {
    method: 'POST',
    uri: `https://hooks.zapier.com/hooks/catch/2261684/ohex8nr/`,
    form: {
        FTD: 0,
        leads: 0,
        date: ''
    },
    headers: {},
    json: true
};

async function main() {
    let leads = await getLeads.main();
    let ftds = await getFTDs.main();
    options.form.FTD = ftds.length;
    options.form.leads = leads.length;
    options.form.date = d;
    rp(options).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
}

main();