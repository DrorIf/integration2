const rp = require('request-promise');
const p = console.log;

const fireBaseForm = {
    'name': 'test',
    'last name': 'testF',
    'email': 'testmail@mail.com',
    'phone': '0546900495',
    '2nd phone': 'none',
    'source': 'test-source',
    'extra data': JSON.stringify({loan: '60000', cc: 'credit', meukal: 'no'}),
    'status': '0', // status from the API response {0=success, mail dup=duplicate, any= error}
    'date created': '', // the date
    'country': 'IL',
    'client': 'Sofi-Loans',
};

function fireBaseInsert(form) {
    let options = {
        method: 'POST',
        url: 'https://dwbpin26a9.execute-api.eu-west-1.amazonaws.com/default/insertleadfirestore',
        form: form,
        headers: {}
    }
    rp(options).then(result => {
        console.log('success on sending to fireBase, the result:', result);
        return;
    }).catch(error => {
        console.log('errored..\n', error);
        return;
    });
}

fireBaseInsert(fireBaseForm);