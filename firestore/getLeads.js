const csvWriter = require('../CSV/writeToCsv');
const pathBase = '/Users/drorifrah/Documents/Projects';
const folderName = '/firestore';
const d = new Date();
const date = d.getDate();
const month = (d.getMonth() + 1).toString();
const year = d.getFullYear();
const fileName = `leads${date}${month.length > 1 ? month : '0' + month}${year}.csv`;
const path = pathBase + folderName + '/data/' + fileName;
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
    .where("country", "==", "IT") 
    .where("date created", "==", 1596456996613) 
    // .where("date created", "<=", 1579608038000) // 
    .get()
    .then(res => {
        console.log(`res length: ${res.docs.length}`);
        res.forEach(doc => {
            let data = doc.data();
            console.log(data);
            dataArr.push(data);
            // if (matchClientForItaly(data, ['AFFclan', 'Vikings-Network','Ted-Marketing'])) {
            // if (data['date created'] > 1587353975000) {
            //     let date = new Date(data['date created']);
            //     // p(data['date created']);
            //     data['date created'] = date;
            //     data['date created'] = date.toISOString();
            //     dataArr.push(data);
            // }
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
       'Vikings-Network',
       'Pr-Digital'
    ];
    let result = clientArr.includes(lead['client']);
    result = result && lead['status'] !== '0';
    result = result && !exclude.includes(lead['client']);
    return result;
}
function matchClientForBeny(lead) {
    const clientArr = [
       'franceCapital',
    ];
    // console.log(lead['status']);
    // console.log(typeof(lead['status']));
    return (clientArr.includes(lead['client']) && lead['status'] !== '0' && lead['status'] !== 'mail dup');
}