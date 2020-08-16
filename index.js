const rp = require('request-promise');
let pathBase = '/Users/drorifrah/Documents/Projects/IntegrationsV2/integration-tests/';
const csvWriter = require('./csv/writeToCsv');
const path = pathBase + 'data.csv';

const p = console.log;


const arr = [
{
  a: 1,
  b: 2
},
{
  a: 'a',
  b: 'b'
}
];
csvWriter.writeDataToCsv(arr).then(res => {
  p(res);
}).catch(err => {
  p(err);
});


// const api = require('smsedge-api-node-js');

// const SMSEdgeApi = new api('L_We-xSHb1QMPSZO6t'); // api_key is required, For example: K_xGA286GbLxGf7zWM;


// const fields = {
//   from: '0546900495',
//   to: 972546900495,
//   text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
//   name: 'John Doe',
//   email: 'johndoe@email.com',
//   reference: 'some_string',
//   shorten_url: true, // By default false.
//   transactional: true,
//   preferred_route_id: '1', // List of routes on getRoutes() function.
//   delay: '10' // Delay by seconds
// }

// SMSEdgeApi.sendSingleSms(fields, (cb) => {
//  console.log(cb);
// });















// t1 = "Questo video può cambiare il tuo modo di pensare."
// t2 = "Questo video farà la differenza nella tua vita"
// t3 = "Preparato a un cambiamento? Guarda il video."
// t4 = "Hai mai considerato un grande cambiamento di vita?"
// t5 = "Non smettere mai di innovare la tua vita! Guarda questo video sensazionale"
// t6 = "Questa sensazionale startup mostra finalmente alle persone cosa stanno facendo"
// t7 = "Testimonia e cambia la tua vita"
// t8 = "I tempi duri devono ancora passare. Vivi una vita migliore dopo aver visto questo video"
// t9 = "Hai mai visto un video che cambia davvero la vita?"
// t10 = "Questi giorni difficili richiedono soluzioni creative."
// t11 = "Deve essere visto."
// t12 = "Questo è un modo per superare questi tempi difficili."
// t13 = "La startup innovative dà una chance."
// t14 = "Questo è un nuovo modo di vivere."
// t15 = "Nuovo sistema innovative per essere finanziariamente stabile"
// t16 = "Tempi duri richiedono soluzioni intelligenti."
// t17 = "Segreti che possono cambiare il tuo futuro."
// t18 = "Nuova startup per aiutare milioni."
// t19 = "Inizia con qualcosa di nuovo."
// t20 = "Questi tempi creano opportunità."
// t21 = "Non è un’opportunità per te?"
// t22 = "Non è il cambiamento che stavi cercando?"
// t23 = "Il nuovo sistema ti metterà nella direzione giusta"
// t24 = "Risolvi i problemi personalmente."
// t25 = "Centinaia ne stanno già beneficiando."
// t26 = "Questa startup può cambiare la vita."
// t27 = "Il successo può essere condiviso?"
// t28 = "Guarda questo video per cambiare le tue abitudini."
// t29 = "Fermati! Hai già visto questo video prima d’ora? Ti cambia la vita."
// t30 = "Questo nuovo sistema ti porta sulla strada per il successo."

// c1 = "	 Per saperne di più? Clicca qui. 	"
// c2 = "	Vuoi saperne di più? Lasciaci le tue informazioni. 	"
// c3 = "	Lascia le tue informazioni in basso per saperne di più. 	"
// c4 = "	Inizia lasciando le tue informazioni di contatto. 	"
// c5 = "	Lascia le tue informazioni di contatto per iniziare. 	"
// c6 = "	Clicca qui per cambiare la tua vita adesso!	"
// c7 = "	Registrati qui GRATIS >>	"
// c8 = "	Provalo adesso gratis >>	"
// c9 = "	Registrazione gratuita >>	"
// c10 = "	Registrati gratuitamente"
// c11 = "	Comincia ora	"
// c12 = "	Sono pronto a partire	"
// c13 = "	Voglio cominiciare	"
// c14 = "	Vuoi cominciare? Lascia I tuoi dettagli	"
// c15 = "	25 posti disponibili, registrati per avere l’abbonamento gratuito.	"
// c16 = "	Iscriviti per un abbonamento gratuito	"
// c17 = "	Iscrivit e ricevi il sistema gratis	"
// c18 = "	Registrati oggi ed assicurati il futuro	"
// c19 = "	Sfrutta questa straordinaria opportunità ora	"
// c20 = "	Per partecipare, lascia le tue informazioni di contatto	"



// a = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15,
//   t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30]

// b = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10,
//   c11, c12, c13, c14, c15, c16, c17, c18, c19, c20]

// res = {};
// resArr = [];
// lenA = a.length;
// lenB = b.length;
// counter = 0;
// try {
//   for (let i = 0; i < lenA ; i ++) {
//     for (let k = 1; k < lenA; k++) {
//       for (let l = 1; l < lenA; l++) {
//         if ((i + k + l) > (lenA - 1)) continue;

//         for (let j = 0; j < lenB; j ++) {
//           for (let m = 1; m < lenB; m ++) {
//             if ((j + m) > (lenB - 1)) continue;
//             let value = {
//               t1: a[i].trim(),
//               t2: a[i + k].trim(),
//               t3: a[i + k + l].trim(),
//               c1: b[j].trim(),
//               c2: b[j + m].trim(),
//             };
//             if (compare(value, resArr)) {
//               resArr.push(value);
//             }
            
//             counter ++;
//           }
//         }
//       }
//     }
    
    
//   }
// } catch (error) {
//   p(error);
// }
// p(resArr.length);
// // let aResArr = resArr.slice(0, 50);
// // aResArr = aResArr.filter(compare);
// // p(aResArr.length);
// if (resArr.length) {
//   csvWriter.writeDataToCsv(resArr, path).then(response => {
//     p(response);
//   });
// }



function compare(value, self) {
  let l = self.length, v = value, i;
  for (i = 0; i < l; i++) {
    if (!cmp(v, self[i])) return false;
  }
  return true;
}

function cmp(a, b) {
  let diffCounter = 0;

  for (i = 1; i <= 3; i++) {
    if (a[`t${i}`] === b[`t1`]) diffCounter++; 
    if (a[`t${i}`] === b[`t2`]) diffCounter++;
    if (a[`t${i}`] === b[`t3`]) diffCounter++;
    if (i === 2) continue;
    if (a[`c${i}`] === b[`c1`]) diffCounter++; 
    if (a[`c${i}`] === b[`c2`]) diffCounter++;
  }
  return diffCounter < 3;
}


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function correctPhoneIL(options) {
  try {
    const res = await rp(options);
    return res.phone;
  } catch (error) {
    p(error);
  }
}

async function mainSofi() {
  const sofiOptions = {
    method: 'POST',
    uri: 'https://app.callmarker.com/api/simple/customers',
    form: {
      token: '007b8c5fc2f0f3a554618d225748a728',
      campaign: '3045',
      name: '',
      last_name: '',
      source: 'LeadGen',
      number: '',
      custom_field_1682: 'LeadGen',// hight
      custom_field_1683: 'LeadGen',// meukal
      custom_field_1684: 'LeadGen',// CC
      custom_field_1685: 'LeadGen',// id
    },
    headers: {},
    json: true
  };
  let path = basePath + 'sofi.csv';
  const array = await csvReader.getArrayFromCsv(path, ',');
  p(array.length);
  let start = 0, end = array.length, phone = '', counter = 0;
  for (let i = start; i < end; i++) {
    let element = array[i];
    let poal = element['?האם_היו_לך_הוצאות_לפועל_ב_4_שנים_האחרונות'];
    let bank = element['האם_חשבון_הבנק_שלך_מעוקל_או_מוגבל_?'];
    let cc = element['איזה_אמצעי_חיוב_יש_לך?'];
    if (element['name'] === '') {
      continue;
    }
    if (!(poal.includes('לא'))) {
      continue;
    }
    if (!(bank.includes('לא'))) {
      continue;
    }
    if (!(cc.includes('אשראי'))) {
      continue;
    }
    phoneOptions.form.phone = element['phone_number'];
    phone = await correctPhoneIL(phoneOptions);
    sofiOptions.form.number = phone;
    sofiOptions.form.name = element['full_name'];
    sofiOptions.form.last_name = element['full_name'];
    sofiOptions.form.custom_field_1682 = element['מה_גובה_ההלוואה_שתרצה_(בין_10,000_ל_80,000)'];
    sofiOptions.form.custom_field_1683 = bank;
    sofiOptions.form.custom_field_1684 = cc;
    sofiOptions.form.custom_field_1685 = element['id'];
    

    p(sofiOptions);
    await p(send(sofiOptions));
    await sleep(Math.floor(Math.random() * 9000));
    counter++;
  }
  p(counter);
} 
async function send(options) {
  try {
    const res = await rp(options);
    p(res);

  } catch (error) {
    p(error);
  }
}
async function mainAmir() {
  const amirOptions = {
    method: 'POST',
    uri: 'http://leads.expand-credit.com/NewLead',
    form: {
      name: 'dror the man',
      cellphone: '0546900497',
      interested_in: 1,
      LeadSupplier: 'דרור לידים',
      msg: 'תביא תכסף'
    },
    headers: {},
    json: true
  };
  let path = basePath + 'loans.csv';
  const array = await csvReader.getArrayFromCsv(path, ',');
  let start = 0, end = array.length, phone = '';
  for (let i = start; i < end; i++) {
    let element = array[i];
    if (element['name'] === '') {
      continue;
    }
    phoneOptions.form.phone = element['cellphone'];
    phone = await correctPhoneIL(phoneOptions);
    amirOptions.form.cellphone = phone;
    amirOptions.form.interested_in = element.interested_in;
    amirOptions.form.name = element.name;
    amirOptions.form.msg = `גובה הלוואה: ${element.Loan}`;
    amirOptions.form.LeadSupplier = element.LeadSupplier;
    p(amirOptions);
    await p(send(amirOptions));
    await sleep(Math.floor(Math.random() * 30000));
  }
} 

async function mainTest() {
  const options = {
    method: 'POST',
    uri: 'https://qmdlwkzfbg.execute-api.eu-west-1.amazonaws.com/default/italyFilter',
    form: {
      campaign:	'CG 2.2 || 09/04/20 || IT',
      'banner info': 'campaign=CG 2.2 || 09/04/20 || IT | adset=OPEN | ad=CG2.2 PM',
      name:	'Beniamino Noli',
      'extra data':	'3473166864',
      phone: '+13473166864',
      leadid:	668165133759009,
      counter:	5,
      email:	'beniamino.noli.sardegna@gmail.com',
    },
    headers: {},
    json: true
  };
  try {
    const res = await rp(options);
    p(res);
  } catch (error) {
    p(error);
  }
}

// moshe leads loans API
//&f1=<טלפון>&f2=<שם_פרטי>&f3=<סוג_כרטיס>&f4=<מוגבל__מעוקל>&f5=<הוצלפ>
// let url = 'https://moshe.mindc.co/api/rule14_api.php?auth_key=b18102c1a546082e648eef35d94249d0';
// let phone = '0546900495';
// let email = 'email@email.com';
// let hotzlap = 'Yes';
// let meokal = 'Yes';
// let cc = 'credit card';
// let name = 'Dror HaGever';
// url = url + `&f1=${phone}&f2=${name}&f3=${cc}&f4=${meokal}&f5=${hotzlap}&f6=${email}`; 
// const options = {
//     method: 'GET',
//     uri: url,
//     form: {},
//     headers: {},
//     json: true
// };

// rp(options).then(res => {
//     p(res);
// }).catch(err => { 
//     p(err);
// });