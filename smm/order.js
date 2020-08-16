const apiKey = 'adfd6a10381c06882ce9db95d18b6aa9';
const apiUrl = 'https://smmpanel.net/api/v2';
const rp = require('request-promise');

function orderFollowers(data) {
    rp({
        method: 'POST',
        uri: apiUrl,
        body: {
            key: apiKey,
            action: 'add',
            service: '2766',
            link: `https://www.instagram.com/${data['username']}`,
            quantity: data['quantity'],
        },
        headers: {},
        json: true
    }).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(error);
        // TODO: send email/sms that notify about the error
    });
}

function main() {
    orderFollowers({
        username: 'ifrahdror', 
        quantity: 100
    });
}

main();