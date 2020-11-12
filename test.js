const p = console.log;
const rp = require('request-promise');
// const dror = require('./dror.json');
// p(dror);

//TODO send this lead to BENY
// {
//     "banner info": "wlbca501dk531bj2iddlca8k | prismanl-capitalvotreargentnewsletter-title-+ 125 000 euros à placer ? le livret bancaire alternatif jusqu’à 8,5 %",
//     "campaign": "TAB-placement-alternatif/",
//     "email": "jacquelinelemee@orange.fr",
//     "extra data": "DESKTOP",
//     "name": "JACQUELINE LEMEE",
//     "phone": "0687578456"
// }
// {
//     "banner info": MPC_1 | MPC_2
//     "campaign": so,
//     "email": email,
//     "extra data": MPC_3,
//     "name": FULL NAME,
//     "phone": phone
// // }

// {
//     "collection": "FR-SPLITER",
//     "doc": "counter",
//     "docData": {"ava":0, "sheet":0, "flag": true}
// }
// let d = new Date();
// p(d.toLocaleString());
// d = d.toISOString();
// let x = d.split('T')[0] + ' ' + d.split('T')[1].split('.')[0];
// x += ' GMT-0200';
// p(x);
// let d2 = new Date(x).toISOString();
// let x2 = d2.split('T')[0] + ' ' + d2.split('T')[1].split('.')[0];

// const get_options = {
//     method: 'POST',
//     url: 'https://k50o7xj2wd.execute-api.eu-west-1.amazonaws.com/default/getFromFirestore', 
//     form: {
//         collection: 'FR-SPLITER',
//         doc: 'counter',
//     },
//     headers: {},
//     json: true
// }
const set_options = {
    method: 'POST',
    url: ' https://h6jebcnrs2.execute-api.eu-west-1.amazonaws.com/default/fr2Filter', 
    form: {
        collection: 'FR-SPLITER',
        doc: 'counter',
        docData: JSON.stringify({ava: 0, sheet: 0})
    },
    headers: {},
    json: true
}
rp(set_options).then(res => {
    p(res);
    p(typeof(res));

}).catch(err => {
    p(err);
});


// let ava_counter = 0, sheet_counter = 0, flag = true; // get from DB
// for (let i = 0; i < 100; i++) {
//     let total = ava_counter + sheet_counter;
//     p('ava:', ava_counter);
//     p('sheet:', sheet_counter);
//     p('total:', total);
//     p('(total/sheet_counter):', (total/sheet_counter));
//     // split 10% to ava
//     if (flag) {
//         // send to sheet
//         sheet_counter++;
//         flag = false;
//     } else {
//         if ( (sheet_counter/sheet_counter) < 0.9 ) {
//             // send to sheet
//             sheet_counter++;
//         } else {
//             // send to ava
//             ava_counter++;
//         }
//     }
// }
// p("final\n")
// p('ava:', ava_counter);
// p('sheet:', sheet_counter);




// let date = new Date();
// // date.setHours(date.getHours()-3);
// // output = {date: date.toString()};
// const fs = require('fs');
// const iconvLite = require('iconv-lite');
// const deEncapsulateSync = require('rtf-stream-parser');
// const path = '/Users/drorifrah/Downloads/241 aaccounts for DROR .rtf';
 
// const input = fs.createReadStream(path);
// const output = fs.createWriteStream('output.html');
 
// input.pipe(new Tokenize())
//      .pipe(new DeEncapsulate({
//          decode: iconvLite.decode
//          mode: 'either'
//      })
//      .pipe(output);
