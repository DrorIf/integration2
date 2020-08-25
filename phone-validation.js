const apiKey = "pv-0492d620a568c9652149b7ed759893ee";
const phoneValidator = require("phone-validator-net");
const rp = require('request-promise');


const validatorInstance = phoneValidator.default(apiKey);
const phoneObject = {
    'APIkey': apiKey,
    "PhoneNumber": "+491749698471",
    "countrycode": "de",
    "mode": "extensive"
};
// console.log(phoneObject);
const options = {
    method: 'GET',
    uri: 'https://api.phone-validator.net/api/v2/verify?',
    qs: phoneObject,
    headers: {},
    json: true
}
console.log(options);
async function main() {
    // const responseObject = await validatorInstance(phoneObject);
    const responseObject = await rp(options);
    console.log(responseObject);
}

main();