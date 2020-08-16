const csvWriter = require('../CSV/writeToCsv');
const pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/firestore/';
const d = new Date();
const date = d.getDate();
const month = (d.getMonth() + 1).toString();
const year = d.getFullYear();
const fileName = `FRleads${date}${month.length > 1 ? month : '0' + month}${year}.csv`;
const path = pathBase + 'data/' + fileName;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const p = console.log;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testproject-7119e.firebaseio.com/'
});
let db = admin.firestore();
db.settings({timestampsInSnapshots: true});

let dataArr = [];
db.collection("leads")
    .where("date created", ">=", 1580548474000) // last time was done 01/02/2020T13:00
    // .where("date created", "<=", 1579608038000) // 
    .get()
    .then(res => {
        console.log(`res length: ${res.docs.length}`);
        res.forEach(doc => {
            let data = doc.data();
            if (matchClientForBeny(data)) {
                let date = new Date(data['date created']);
                // p(data['date created']);
                data['date created'] = date;
                data['date created'] = date.toISOString();
                dataArr.push(data);
            }
        }); 
    })
    .then(() => {
        csvWriter.writeDataToCsv(dataArr, path)
        .then(writeRes => p(writeRes))
        .catch(writeError => p(writeError));
    })
    .catch(error => {
        console.log('error');
        console.log(error);
    });

function matchClientForVikings(lead) {
    const clientArr = [
       'AFFclan',
       'Ted-Marketing',
    ];
    console.log(lead['status']);
    console.log(typeof(lead['status']));
    return (clientArr.includes(lead['client']) && lead['status'] !== '0');
}
function matchClientForItaly(lead, exclude) {
    const clientArr = [
       'AFFclan',
       'Ted-Marketing',
       'Vikings-Network'
    ];
    return (clientArr.includes(lead['client']) && lead['status'] !== '0' && lead['client'] !== exclude);
}
function matchClientForBeny(lead) {
    const clientArr = [
       'franceCapital',
    ];
    // console.log(lead['status']);
    // console.log(typeof(lead['status']));
    return (clientArr.includes(lead['client']) && lead['status'] !== '0' && lead['status'] !== 'mail dup');
}