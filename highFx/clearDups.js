const p = console.log;
const csvReader = require('../csv/readCsvAndPassArray');
const csvWriter = require('../CSV/writeToCsv');
const pathbase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/highFx/mergedCsvs/';
const path = pathbase + '2019-11-10.csv';
pathToSaveBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/highFx/';
pathToSave = pathToSaveBase + 'mergedUniqu.csv';
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
        let data = await csvReader.getArrayFromCsv(path, ',');
        console.log(data.length);
        var myData = data;
        data = Array.from(new Set(myData.map(JSON.stringify))).map(JSON.parse);
        console.log(data.length);

        let resultCsv = await csvWriter.writeDataToCsv(data, pathToSave);
        console.log(resultCsv);
    } catch (error) {
        p(error);
    }

}

main();