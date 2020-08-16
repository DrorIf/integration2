const csvWriter = require('../csv/writeToCsv');
const csvReader = require('../csv/readCsvAndPassArray');
const pathRead = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/highFx/mergedUniqu.csv';
const pathSave = './stats.csv';
const p = console.log;


async function main() {
    try {
        const arrayRead = await csvReader.getArrayFromCsv(pathRead, ',');
        // console.log('arrayRead: ', arrayRead.length);
        const groupBywidget = groupping('widget', 1);
        const groupByStatus = groupping('status', 1);
        const stats = groupBywidget(arrayRead);
        const finalStats = {};
        // p(stats);
        Object.keys(stats).forEach(widget => {
            finalStats[widget] = {};
             let help = groupByStatus(stats[widget]);
             Object.keys(help).forEach(status => {
                 finalStats[widget][status] = help[status].length;
             });
            let sortable = [];
            for (let status in finalStats[widget]) {
                sortable.push([status, finalStats[widget][status]]);
            }
            sortable.sort(function(a, b) {
                return a[1] - b[1];
            });
            p(widget + ':');
            p(sortable);
        });

        

        // p(finalStats);


    } catch (error) {
        console.log('error on promise:\n');
        console.log(error);
    }
}

main();


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

