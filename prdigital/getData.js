const getLeads = require('./getLeads.js');
const getFTDs = require('./getFTDs.js');
const rp = require('request-promise');
const d = new Date();

async function main() {
    // let ftds = await getFTDs.main();
    // console.log('in getData main: res,', ftds.length);
    getLeads.main();
}

main();