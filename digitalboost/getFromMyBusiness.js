const appId = 'aaaaaaac9eb602abd47fd0ec33e88c010ca217c1';
const masterKey = '6c5f1b6846585c68fec06dd99e8ad52d';
const baseUrl = 'https://apps.simbla.com/parse';
const rp = require('request-promise');
const p = console.log;


let url = baseUrl + `/classes/Accounts`;

const options = {
    method: 'POST',
    uri: url,
    form: {
        "_method": "get",
        "where":JSON.stringify({
            "Email":"shiri.havkin@gmail.com"
        })
    },
    headers: {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': appId,
        'X-Parse-Master-Key': masterKey
    }
};

rp(options).then(res => {
    res = JSON.parse(res);
    len = res.results.length;
    p(res.results);
    p(len);
}).catch(err =>  {
    p(err);
});