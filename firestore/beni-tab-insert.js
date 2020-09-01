const rp = require('request-promise');
const p = console.log;
const csvReader = require('../CSV/readCsvandPassArray');
const folderName = 'firestore/data';
const fileName = 'beni-leads.csv';
''
let path = `/Users/drorifrah/Documents/Projects/integration-tests-master/${folderName}/csvToSend/${fileName}`;


const fireBaseForm = {
    'name': '',
    'last name': '',
    'email': '',
    'phone': '',
    '2nd phone': '',
    'source': '',
    'extra data': '',
    'status': '0', 
    'date created': '',
    'country': 'FR',
    'client': 'Beny-Tab',
};

async function main() {
    const arr = await csvReader.getArrayFromCsv(path, ',');
    len = arr.length;
    for (let i = 0; i < len; i++) {
        let lead = arr[i];
        fireBaseForm["date created"] = new Date(lead['date'].split(' ')[1]).getTime();
        fireBaseForm.name = getFname(lead.name);
        fireBaseForm["last name"] = getLname(lead.name);
        fireBaseForm.email = lead.mail;
        fireBaseForm.phone = lead["phone "];
        fireBaseForm.source = lead["campaign name "];
        fireBaseForm["extra data"] = lead["extra data"];
        p(fireBaseForm);
        try {
            const result = await fireBaseInsert(fireBaseForm);
            p(result);
        } catch (error) {
            p(error);
        }

    }
}
function fireBaseInsert(form) {
    let options = {
        method: 'POST',
        url: 'https://dwbpin26a9.execute-api.eu-west-1.amazonaws.com/default/insertleadfirestore',
        form: form,
        headers: {}
    }
    return rp(options);
}
function getFname(name) {
    if (name.split(' ')[0] !== '' && name.split(' ')[0] !== null && name.split(' ')[0] !== undefined ) {
        return name.split(' ')[0];
    } else {
        return name;
    }
}
function getLname(name) {
    let newName = name;
    if (newName.split(' ').length > 2) {
        // p('--- --- ---\n',newName);
        let regex = /\s\s+/;
        newName = name.replace(regex, ' ');
        // p(newName);
    }
    if (newName.split(' ')[1] !== '' && newName.split(' ')[1] !== null && newName.split(' ')[1] !== undefined ) {
        const index = newName.indexOf(' ');
        return newName.substring(index).trim();
    } else {
        return name;
    }
}

main();