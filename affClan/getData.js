const basePath = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests';
const getLeads = require(`${basePath}/affClan/getLeads.js`);
const getFTDs = require(`${basePath}/affClan/getFTDs.js`);
const rp = require('request-promise');
const d = new Date();
const options = {
    method: 'POST',
    uri: `https://hooks.zapier.com/hooks/catch/2261684/ohep25o/`,
    form: {
        FTD: 0,
        leads: 0,
        date: ''
    },
    headers: {},
    json: true
};
async function main() {
    let ftds = await getFTDs.main();
    options.form.FTD = ftds.length;
    options.form.date = d;
    let leads = await getLeads.main();
    console.log("-- -- -- -- -->>> ->", leads.length);
    options.form.leads = leads.length;
    console.log(options);
    rp(options).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });


}

main();