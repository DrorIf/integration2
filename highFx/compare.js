const p = console.log;
const csvReader = require('../csv/readCsvAndPassArray');
const pathbase1 = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/highFx/data/';
const path1 = pathbase1 + 'leads_status_28_10_19.csv';
const pathbase2 = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/highFx/mergedCsvs/';
let path2 = pathbase2 + '2019-11-10.csv';
function includeByAttr(arr, key, value) {
    let found = false;
    for(let i = 0; i < arr.length; i++) {
        if (arr[i][key].toLowerCase() === value.toLowerCase()) {
            found = true;
            break;
        }
    }
    return found;
}


async function main() {
    try {
        let arr1 = await csvReader.getArrayFromCsv(path1, ',');
        let merged = await csvReader.getArrayFromCsv(path2, ',');
        for (let i = 0; i < arr1.length; i++) {
            leadFromCrm = arr1[i];
            if (!includeByAttr(merged, 'email', leadFromCrm['Email'])) {
                p('missing: ', leadFromCrm['Email']);
            }
        }   
    } catch (error) {
        p(error);
    }

}

main();