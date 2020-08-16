const rp = require('request-promise');
const baseEnd_Url = 'api/pull/customers';
const p = console.log;

function getFTDs(args) {
    
    console.log(`---------------- TrackBox Get FTDs for ${args['platform']} ----------------`);
    return new Promise((resolve, reject) => {
        try {
            const myForm = {
                from: args['from'], //'2019-10-01 00:00:00',
                to: args['to'], //'2119-06-17 23:59:59',
                type: '4',

            };
            const options = {
                method: 'POST',
                uri: `https://${args['platform']}/${baseEnd_Url}`,
                form: JSON.stringify(myForm),
                headers: {
                    'x-trackbox-username': args['x-trackbox-username'],
                    'x-trackbox-password': args['x-trackbox-password'],
                    'x-api-key': args['x-api-key'],
                    'Content-Type': 'application/json'
                },
                json: true
            };
            let leads = []; 
            // console.log(options);
            rp(options)
            .then(res => {
                // p(res.data[1]);
                if (res.status) {
                    console.log('Total FTD\'s: ', res.data.length);
                    res.data.forEach(lead => {
                        leads.push({
                            email: lead['customerData']['email'],
                            created: lead['customerData']['created'],
                            ftd: lead['customerData']['first_depositDate'],
                            status: lead['customerData']['call_status'],
                            broker: getBroker(lead),
                            campagin: lead['tracking']['so'],
                            campagin_name: getCampaignName(lead),
                            adset: getAdSet(lead),
                            ad: getAd(lead),
                            leadCRMid: lead['customerData']['id']

                        });
                    });
                    resolve(leads);
                } else {
                    console.log('request failed');
                    console.log(res);
                    reject(res);
                }
            }).catch(rpError => {
                console.log('errored on rp');
                console.log(rpError);
                reject(rpError);
            });  
        } catch (error) {
            console.log('Catched general error:\n', error);
            reject(error);
        }
    });
}

exports.getFTDs = getFTDs;

function getBroker(lead) {
    try {
        if (lead['brandResponse']['data']['loginURL'] !== null) {
            return (lead['brandResponse']['data']['loginURL']).split('/authorization')[0].substr(8).split('.')[0];
        } else {
            // console.log(lead);
            return 'noBroker';
        }
    } catch (error) {
        return 'noBroker';
    }
}
function getAdSet(lead) {
    try {
        let split = (lead['tracking']['MPC_2']).split('|');
        if (split[1] !== undefined && split[1] !== '' && split[1] !== null) {
            return split[1].split('=')[1];
        } else {
            return 'no adset';
        }
    } catch (error) {
        return 'no adset';
    }
}
function getCampaignName(lead) {
    try {
        let split = (lead['tracking']['MPC_2']).split('|');
        // [0].split('=')[1]
        if (split[0] !== undefined && split[0] !== '' && split[0] !== null) {
            return split[0].split('=')[1];
        } else {
            return 'no campagin';
        }
    } catch (error) {
        return 'no campagin';
    }
}
function getAd(lead) {
    try {
        let split = (lead['tracking']['MPC_2']).split('|');
        if (split[2] !== undefined && split[2] !== '' && split[2] !== null) {
            return split[2].split('=')[1];
        } else {
            return 'no adset';
        }
    } catch (error) {
        return 'no adset';
    }
}




