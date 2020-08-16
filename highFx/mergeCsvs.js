const csvWriter = require('../csv/writeToCsv');
const csvReader = require('../csv/readCsvAndPassArray');
const path1 = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/highFx/data/leads_status_28_10_19.csv';
const path2 = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/csv/saved csvs/Tue Oct 29 2019 - Ver14_48.csv';

function includeByAttr(arr, key, value) {
    let found = false;
    for(let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
            found = true;
            break;
        }
    }
    return found;
}
 
async function main() {
    try {
        let exsits = 0, notExsist = 0;
        const array1 = await csvReader.getArrayFromCsv(path1, ',');
        console.log('array1: ', array1.length);
        const array2 = await csvReader.getArrayFromCsv(path2, ',');
        console.log('array2: ', array2.length);
        const mergedArray = [], index = [];
        for (let i = 0; i < array1.length; i++) {
            let finalLead = {};
            let lead1 = array1[i];
            for (let j = 0; j < array2.length; j++) {
                let lead2 = array2[j];
                if (lead1['Email'].toLowerCase() === lead2['email'].toLowerCase() || lead1['Email'].toLowerCase() === ('0' + lead2['email'].toLowerCase())) {
                    finalLead['name'] = lead2['name'] + lead2['last name'];
                    finalLead['email'] = lead1['Email'];
                    finalLead['phone'] = lead2['phone'];
                    // finalLead['2nd phone'] = lead2['2nd phone'];
                    finalLead['date'] = lead1['Creation Date'];
                    finalLead['status'] = lead1['Lead Status Reason'];
                    finalLead['optimization data'] = lead2['extra data'];
                    finalLead['widget'] = getWid(lead2['extra data']);
                    finalLead['country'] = lead2['country'];
                    mergedArray.push(finalLead);
                    index.push(array2.indexOf(lead2));
                    continue;
                }
            }

        }
        console.log(`merged array length: ${mergedArray.length}`);
        const fileName = `${new Date().toISOString().split('T')[0]}.csv`;
        let path = `/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/highFx/mergedCsvs/${fileName}`;
        const writeRes = await csvWriter.writeDataToCsv(mergedArray, path);
        p(writeRes);
    } catch (error) {
        console.log('error on promise:\n');
        console.log(error);
    }
}

main();

function getWid(exData) {
    let spl = exData.split('|');
    let widget = spl[1].split('=')[1];
    return widget;
}
