const csv = require('csv-parser')
const fs = require('fs')
const stripBomStream = require('strip-bom-stream');

function getArrayFromCsv(path, delimiter) {
    const results = [];
    return new Promise(
        (reslove, reject) => {
            if (!path) {
                reject('cannot read witouh path');
            }
            try {
                fs.createReadStream(path)
                  .pipe(stripBomStream())
                  .pipe(csv({separator: delimiter}))
                  .on('data', (data) => {
                    //   console.log(Object.keys(data));
                      results.push(data);
                    })
                  .on('end', () => {
                    reslove(results);
                  });
            } catch (errorOnRead) {
                console.log('got an error on read, pass on');
                reject(error);
            }
        }
    );
    
}


exports.getArrayFromCsv = getArrayFromCsv;
 