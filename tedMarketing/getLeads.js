const rp = require('request-promise');
const trackbox = require('../trackBox/getLeads');
const csvWriter = require('../CSV/writeToCsv');
const pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/tedMarketing/';
const fileName = `${new Date().toISOString().split('T')[0]}.csv`;
const path = pathBase + 'data/Leads - ' + fileName;
const statsPath = pathBase + 'data/Stats - ' + fileName;
const args = require('./args.json');
const p = console.log;

function main() {
  return trackbox.getLeads(args)
  .then(res => {
    const groupByStatus = groupping('status', 1);
    const stats = groupByStatus(res);
    const csvStats = [];
    Object.keys(stats).forEach(status => {
      csvStats.push(
        {
          status: status,
          Amount: stats[status].length,
          Rate: `${(stats[status].length/res.length*100).toFixed(3)} %`
        }
      );
    });
    csvStats.sort((a, b) => a.status - b.status);
    csvStats.push(
      {
        status: 'Total',
        Amount: res.length,
        Rate: `${100} %`
      }
    );
    // writing stats
    csvWriter.writeDataToCsv(csvStats, statsPath)
    .then(writeRes => p(writeRes))
    .catch(writeError => p(writeError));

    // writing all leads
    csvWriter.writeDataToCsv(res, path)
    .then(writeRes => p(writeRes))
    .catch(writeError => p(writeError));
      return res;
  }).catch(thenError => {
    p(thenError);
  });
  
}
function groupping(key, steps) {
  if (steps === 1) {
      return array => array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
          return objectsByKeyValue;
        }, {});
  } else {
      return array => array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key[0]][key[1]];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
          return objectsByKeyValue;
        }, {});
  }
}

exports.main = main;


