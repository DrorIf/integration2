const pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests';
const trackbox = require(`${pathBase}/trackBox/getLeads`);
const csvWriter = require(`${pathBase}/CSV/writeToCsv`);
const fileName = `${new Date().toISOString().split('T')[0]}.csv`;
const path = pathBase + '/NGM/data/Leads - ' + fileName;
const statsPath = pathBase + '/NGM/data/Stats - ' + fileName;
const args = require('./args.json');
const p = console.log;
const groupByBroker = groupping('broker', 1);
const groupByStatus = groupping('status', 1);
const groupByCmp = groupping('campagin_name', 1);
const groupByAdset = groupping('adset', 1);
function main() {
  trackbox.getLeads(args)
  .then(async res => {
    try {
      const wrRes = await csvWriter.writeDataToCsv(res, path);
      p(wrRes);
    } catch (error) {
      p(error);
    }
    const brokersData = groupByBroker(res);
    const campaignsData = groupByCmp(res);
    const adsetsData = groupByAdset(res);
    let arr, campaigns = [], adsets = [], brokers = []
    let campaignData = {}, brokerData = {}, adsetData = {};

    // group by broker and arrange data.
    let x = 1;
    Object.keys(brokersData).forEach(async broker => {
      let brokerLeads = brokersData[broker];
      brokerData = getDataByStatus(broker, brokerLeads);
      if (brokerData['name'] === '' || brokerData['name'] === undefined) {
        brokerData['name'] = `broker# ${x}`;
        x++;
      }
      let brokerPath = `${pathBase}/NGM/data/brokers/${brokerData['name'].trim()}.csv`;
      arr = [];
      arr = convertToArray(brokerData['stats']);
      await saveToCSV(arr, brokerPath);
      brokers.push(brokerData);
    });

/*    x = 1;
    // group by campaign and arrange data.
    Object.keys(campaignsData).forEach(async campaign => {
      let campaignLeads = campaignsData[campaign];
      campaignData = getDataByStatus(campaign, campaignLeads);
      if (campaignData['name'] === '' || campaignData['name'] === undefined) {
        campaignData['name'] = `campaign# ${x}`;
        x++;
      }
      console.log(campaignData['name']);
      let campaignPath = `/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/vikingsNetwork/data/campaigns/${campaignData['name'].trim()}.csv`;
      arr = [];
      arr = convertToArray(campaignData['stats']);
      await saveToCSV(arr, campaignPath);
      // printCampaign(campaignData);
      campaigns.push(campaignData);
    });

    // group by adset and arrange data.
    Object.keys(adsetsData).forEach(adset => {
      let adsetLeads = adsetsData[adset];
      adsetData = getDataByStatus(adset, adsetLeads);
      printAdset(adsetData);
      adsets.push(adsetData);
    });

    */
  }).catch(thenError => {
    p(thenError);
  });
}

// return groupped array objects by key.
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

// return the stats per status for groupped leads by status.
function getBrokerStats(total, statsGr) {
  const stats = [];
  Object.keys(statsGr).forEach(status => {
    stats.push({
      status: status,
      amount: statsGr[status].length,
      rate: `${(statsGr[status].length/total*100).toFixed(3)} %`
    });
  });
  return stats.sort(sortByStatus);
}

// prints brokerData in a view format
function printBroker(broker) {
  p('----------------------------------------');
  p(`\u001b[1;37mName: \u001b[1;34m${broker['name']}`);
  p('\u001b[1;37mStats: ');
  broker['stats'].forEach(status => {
    printStatus(status);
  });
  p(`\n\u001b[1;37mTotal leads: \u001b[1;33m${broker['total']}`);
}

// prints campaign data in a view format
function printCampaign(campaign) {
  p('----------------------------------------');
  p(`\u001b[1;37mName: \u001b[1;34m${campaign['name']}`);
  p('\u001b[1;37mStats: ');
  campaign['stats'].forEach(status => {
    printStatus(status);
  });
  p(`\n\u001b[1;37mTotal leads: \u001b[1;33m${campaign['total']}`);
}

// prints adset data in a view format
function printAdset(adset) {
  p('----------------------------------------');
  p(`\u001b[1;37mName: \u001b[1;34m${adset['name']}`);
  p('\u001b[1;37mStats: ');
  adset['stats'].forEach(status => {
    printStatus(status);
  });
  p(`\n\u001b[1;37mTotal leads: \u001b[1;33m${adset['total']}`);
}

// print status line in a view format
function printStatus(status) {
  p(`\t\u001b[0;37m${status['status']} \u001b[1;31m{ \u001b[0;37m#leads: \u001b[1;32m${status['amount']}, \u001b[0;37mrate: \u001b[1;32m${status['rate']} \u001b[1;31m}`);
}

// sort functions to sort array of objects by the 'status' key
function sortByStatus(a, b) {
  if (a.status < b.status) {return -1}
  else if (a.status > b.status) {return 1}
  else {return 0}
}

// return the stats array with 'name, number, rate' per status.
function getDataByStatus(broker, brokerLeads) {
  let brokerData = {};
  const brokerFTDs = brokerLeads.filter(lead => lead['isFTD'] === '1');
  brokerLeads = brokerLeads.filter(lead => !brokerFTDs.includes(lead));
  brokerData['name'] = broker;
  brokerData['total'] = brokerLeads.length + brokerFTDs.length;
  let statsGr = groupByStatus(brokerLeads);
  brokerData['stats'] = getBrokerStats(brokerData['total'], statsGr);
  brokerData['stats'].unshift({
      status: 'FTD',
      amount: brokerFTDs.length,
      rate: `${(brokerFTDs.length/brokerData['total']*100).toFixed(3)} %`
  });
  return brokerData;
}

function convertToArray(object) {
  return Object.keys(object).map(item => object[item]);
}

async function saveToCSV(array, path) {
  try {
    const wrRes = await csvWriter.writeDataToCsv(array, path);
    p(wrRes);
  } catch (error) {
    p(error);
  }
}

main();


exports.main = main;


