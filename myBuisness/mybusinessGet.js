const appId = 'aaaaaaac9eb602abd47fd0ec33e88c010ca217c1';
const masterKey = '6c5f1b6846585c68fec06dd99e8ad52d';
const baseUrl = 'https://apps.simbla.com/parse/';
const rp = require('request-promise');
const p = console.log
// const Parse = require('parse/node');
// Parse.initialize(appId, null, masterKey);
// Parse.serverURL = baseUrl;
// const Accounts = Parse.Object.extend("Accounts");
// const query = new Parse.Query(Accounts);
// console.log(Parse);

/**
 * 
    let url = baseUrl + "classes/Accounts";
    const options = {
        method: 'POST',
        uri: url,
        body: {
            "_method": "get",
            "where":{
                "PhoneNumber": "0543035037"
            }
        },
        headers: {
            "Content-Type": "application/json",
            "X-Parse-Application-Id": appId,
            "X-Parse-Master-Key": masterKey
        },
        json: true
    }
 */
main();



function leadTestF(accountParms) {
    return new Promise(async (resolve, reject) => {
        try {
            let url = baseUrl + "classes/Accounts";
            const options = {
                method: 'POST',
                uri: url,
                body: {
                    "_method": "get",
                    "where":{
                        "PhoneNumber": accountParms.PhoneNumber.value
                    }
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": appId,
                    "X-Parse-Master-Key": masterKey
                },
                json: true
            }
            const results = await rp(options);
            // console.log(typeof(results)); // object
            // console.log(Object.keys(results)); // [ 'results' ]
            // console.log(typeof(results.results)); // object
            const res = results.results;
            let keys = Object.keys(res);
            console.log(keys);
            if (keys.length === 0) resolve(true); // no such lead yet!
            p(res[keys[keys.length - 1]]['createdAt']);
            const e = new Date(res[keys[keys.length - 1]]['createdAt']);
            p(e);
            let diff = Math.abs(new Date() - e)/86400/1000;
            // p(diff);
            if (diff > 30) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            console.log('Catched error on leadTest:\n', error);
            //if I got an error on quiry - create new lead anyhow
            reject(error);
        }
    });
}
async function main() {
    
    // query.equalTo("Id", "f2ES0Z6cWw");
    try {
        let x;
        if (x) {
            p('wooo');
        } else {
            p('waaa');
        }
        // const accountParms = {PhoneNumber:{value:"0547787794"}}
        // const leadTest = await leadTestF(accountParms);
        // if (leadTest) {
        //     console.log('success !');
        // }
        
        // const results = await rp(options);
        // const results = await query.find();
        // console.log(results.length);
        // console.log(results[23]);
        // console.log(results);
    } catch (error) {
        console.log(error);
    }
}

