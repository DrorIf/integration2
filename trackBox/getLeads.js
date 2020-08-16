const rp = require('request-promise');
const baseEnd_Url = 'api/pull/customers';
let flag = true;
const p = console.log;
const providerCI = {
    1: 'Mock',
    2: '',
    3: '',
    4: '',
    5: '',
    6: 'EverFxGlobal',
    7: 'VikingNetwork - 41',
    8: 'Affclan',
    9: 'NGM',
    10: 'TedMedia',
    11: 'HighFX',
    12: 'LittlermanFX',
    13: 'patronfx',
    14: 'Trafficon - DE',
    15: 'Trafficon - IT',
    16: 'IronClicks',
    17: 'EMediaConnect',
    18: 'Argoads',
    19: 'TopConvert',
    20: 'FelizDigital',
    21: 'Kobi Datalize',
    22: 'LegionMedia - INF(19)',
    23: 'Pr-Viking JV',
    24: 'HighFx - TB',
    25: 'Orel - Loans',
    26: 'LegionMedia - SNP(27)',
    27: 'blogomarsie',
    28: 'LegionMedia - 8%',
    29: '',
    30: '',
    
}
function getLeads(args) {
    
    console.log(`---------------- TrackBox Get Leads for ${args['platform']} ----------------`);
    return new Promise((resolve, reject) => {
        try {
            const myForm = {
                from: args['from'], //'2019-10-01 00:00:00',
                to: args['to'], //'2119-06-17 23:59:59',
                type: '3',
                page: 0

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
            let leadsV2 = []; 
            // console.log(JSON.stringify(options));
            rp(options)
            .then(async res => {
                if (res.status) {
                    // console.log(`page: ${myForm.page}`);
                    // console.log(`data length: ${res.data.length}`);
                    // console.log(`data[185]:\n `, res.data[185]);
                    leads =  leads.concat(res.data);
                    while (res.data.length === 500) {
                        if (!res.status) {
                            console.log('errrrror');
                            console.log(res);
                            return;
                        }
                        myForm.page = myForm.page + 1;
                        stringiForm = JSON.stringify(myForm);
                        options.form = stringiForm;
                        myForm.page % 3 === 0 ? process.stdout.write('.') : process.stdout.write(' ');                        ;
                        // console.log(`page: ${myForm.page}`);
                        res = await rp(options);
                        try {
                            res = JSON.parse(res);
                        } catch (error) {
                            res = res;
                        }
                        leads =  leads.concat(res.data);
                    }
                    console.log('leads.length: ', leads.length);
                    // console.log('leads[1]: ', leads[1]);
                    leads.forEach(lead => {
                        leadsV2.push({
                            email: lead['customerData']['email'],
                            status: lead['customerData']['call_status'],
                            created: lead['customerData']['created'],
                            updated: lead['customerData']['updated'],
                            isFTD: lead['customerData']['depositor'],
                            source: lead['tracking']['so'],
                            broker: getBroker(lead),
                            provider: getProvider(lead),
                            campagin_name: getCampaginName(lead),
                            adset: getAdSet(lead),
                            ad: getAd(lead),
                            loginUrl: lead['brandResponse']['data']['loginURL'] ? lead['brandResponse']['data']['loginURL'] : 'noUrl',
                            token: lead['brandResponse']['data']['token'] ? lead['brandResponse']['data']['token'] : 'no token'
                        });
                    });
                    resolve(leadsV2);

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
        let value = lead['tracking']['MPC_2'].toLowerCase();
        let index = value.indexOf('adset=');
        if (index) {
            let adIndex = value.indexOf('ad=');
            if (adIndex) {
                let x = value.substring(index + 6, adIndex - 3);
                return x;
            } else {
                return value.substr(index);
            }
        } else {
            return 'no adset'
        }
    } catch (error) {
        return 'no adset';
    }
}
function getAd(lead) {
    try {
        let value = lead['tracking']['MPC_2'].toLowerCase();
        let index = value.indexOf('ad=');
        if (index) {
            return value.substring(index + 3);
        } else {
            return 'no adset'
        }
    } catch (error) {
        return 'no adset';
    }
}
function getCampaginName(lead) {
    try {
        let split = lead['tracking']['MPC_2'].split('|');
        if (split[0] !== undefined && split[0] !== '' && split[0] !== null) {
            return split[0].split('=')[1];
        } else {
            return 'no cmp';
        }
    } catch (error) {
        return 'no name';
    }
}
function getProvider(lead) {
    // todo
    if (flag) {
        flag = false;
        p(lead);
    }
    return providerCI[(lead['customerData']['ci'])];
}


exports.getLeads = getLeads;

