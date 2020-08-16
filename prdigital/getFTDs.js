const rp = require('request-promise');
const trackbox = require('../trackBox/getFTDs');
const csvWriter = require('../CSV/writeToCsv');
const pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/prdigital/';
const fileName = `${new Date().toISOString().split('T')[0]}.csv`;
const path = pathBase + 'data/FTDs - ' + fileName;
const args = require('./args.json');
const p = console.log;

async function main() {
  // p(args);
  return trackbox.getFTDs(args)
  .then(async res => {
    res.forEach(e => {
      if (e['broker'] === 'noBroker') {
        e['broker'] = 'Generaltrade';
      }
    });
    try {
      const wrRes = await csvWriter.writeDataToCsv(res, path);
      p(wrRes);
      return res;
    } catch (error) {
      p(error);
    }

  }).catch(thenError => {
    p(thenError);
  });
}



exports.main = main;


