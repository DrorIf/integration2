const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const pathBase = '/Users/drorifrah/Documents/Projects/integration-tests-master/CSV/saved csvs';

function writeDataToCsv(data, path) {
    return new Promise(
        (resolve, reject) => {
            if (!path) {
                let name = `${new Date().toDateString()} - Ver${new Date().getHours()}_${new Date().getMinutes()}`;
                path = `${pathBase}/${name}.csv`;
            }
            if (!data) {
                reject('no data - what to save ?!');
            }
            header = [];
            Object.keys(data[0]).forEach(key => {
                header.push({id: key, title: key});
            });
            const csvWriter = createCsvWriter({
                path: path,
                header: header
            });
            
            let name = path.split('/')[path.split('/').length - 1];
            csvWriter.writeRecords(data).then(() => {
                console.log(`done, file name: ${name}`);
                resolve(name);
            }).catch(writsError => {
                console.log('error on write: \n', writsError);
                reject('error: ', writsError);
            });
        }   
    );


}
// let arr = [
//     {name: "dror", id: 123465789},
//     {name: "dror2", id: 1234657895},
//     {name: "dror3", id: 12346575},
// ];
// main(arr);

exports.writeDataToCsv = writeDataToCsv;