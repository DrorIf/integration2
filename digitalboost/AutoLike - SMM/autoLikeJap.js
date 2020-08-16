const rp = require('request-promise');
const p = console.log;
const smmUrl = 'https://justanotherpanel.com/api/v2';
const smmKey = '27198881356163e22db2c72b5dd2a338';
let smmOptions = {
    method: 'POST',
    uri: smmUrl,
    form: {
        key: smmKey,
        action: 'services'
    },
    headers: {},
    json: true
};
main();
async function main() {
    let serviceId = await getSmmServiceId({quantity: 100});
    // let orderId = await exeSmmOrder(serviceId, 'digitalboost.co.il90', 100);
    // p(`serviceId: ${serviceId},\nOrderId: ${orderId}`);
}
async function exeSmmOrder(serviceId, username, quantity) {
    let postData = {
      key: smmKey,
      action:	'add',
      service: serviceId,
      username: username,
      min: (quantity-5) >= 100 ? (quantity-5): quantity,
      max: quantity+5,
      posts: 30,
      delay: 0,
      expiry: getNextMonthString()
    };
    let optionsAdd = {
      method: 'POST',
      uri: smmUrl,
      form: postData,
      headers: {},
      json: true
    };
    p(`params: ${JSON.stringify(postData)}`);
    try {
        res = await rp(optionsAdd);
        p(res);
        return res.order;
    } catch (error) {
        console.log('an error : ', error);
        return 'no id';
    }
}
async function getSmmServiceId(sale) {
    try{
        let res = await rp(smmOptions);
        res = res.filter(item => item['type'].includes('Subscriptions'));
        res = res.filter(item => item['category'].includes('Instagram Auto Likes'));
        res = res.filter(item => item['name'].includes('Likes'));
        res = res.filter(item => item['min'] <= sale['quantity']);
        res = res.filter(item => item['max'] >= sale['quantity']);
        res = res.filter(item => Number(item['rate']) >= 1.8);
        res = res.filter(item => !item['name'].includes('ARAB'));
        res = res.filter(item => !item['name'].includes('IRAN'));
        res = res.filter(item => !item['name'].includes('MQ'));
        res = res.filter(item => !item['name'].includes('GOOD SPEED'));
        res = res.filter(item => !item['name'].includes('LQ'));
        res = res.filter(item => !item['name'].includes('SUPER FAST'));
        res.sort((a, b) => a['rate'] - b['rate']);
        p(res.length);
        p(res);
        let serviceId = res[0]['service'];
        p(`Service ID: ${serviceId}`);
        return serviceId;
    } catch(error) {
        p('an error');
        p(error);
    }
}

function getNextMonthString() {
    let today = new Date();
    today.setDate(today.getDate() + 30);
    return `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
}