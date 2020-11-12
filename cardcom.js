const rp = require('request-promise');
const { parse } = require('querystring');
const params = require('./cardcomParams.json');
const Parse = require('parse/node');
const p = console.log;

Parse.initialize(params.CRM_APP_ID, null, params.CRM_MASTER_KEY);
Parse.serverURL = params.CRM_BASE_URL;
const _User = Parse.Object.extend("_User");
const Accounts = Parse.Object.extend("Accounts");
const Products = Parse.Object.extend("Products");
const SaleRows = Parse.Object.extend("SaleRows");
const SaleStatuses = Parse.Object.extend("SaleStatuses");
const SaleCategories = Parse.Object.extend("NameList");
const Sales = Parse.Object.extend("Sales");
const LeadStatuses = Parse.Object.extend("LeadStatuses");
const SourceList = Parse.Object.extend("SourceList");
const mediaSourceList = Parse.Object.extend("mediaSourceList");
const AccountStatuses = Parse.Object.extend("AccountStatuses");
const targetAudienceList = Parse.Object.extend("targetAudienceList");
const paymentTypeList = Parse.Object.extend("paymentTypeList"); 
const setUpCallList = Parse.Object.extend("setUpCallList"); 
const cardExpYearList = Parse.Object.extend("cardExpYearList"); 
const cardExpMonthList = Parse.Object.extend("cardExpMonthList"); 
const callStatusList = Parse.Object.extend("callStatusList"); 

const TABLES = {
    "Accounts": Accounts,
    "setUpCallList": setUpCallList,
    "cardExpMonthList": cardExpMonthList,
    "cardExpYearList": cardExpYearList,
    "User": _User,
    "Products": Products,
    "SaleRows": SaleRows,
    "SaleStatuses": SaleStatuses,
    "NameList": SaleCategories,
    "Sales": Sales,
    "paymentTypeList": paymentTypeList,
    "LeadStatuses": LeadStatuses,
    "SourceList": SourceList,
    "mediaSourceList": mediaSourceList,
    "AccountStatuses": AccountStatuses,
    "targetAudienceList": targetAudienceList,
    "LeadStatuses": LeadStatuses,
    "callStatusList": callStatusList,
};

// exports.handler = async (event, context, cb) => {
async function main (event, context, cb) {
    // *** async function !!!!!!!!!
    console.log('------------------------------- cardcom Indicator -------------------------------');

    let form = parse(event.body);
    const responseCB = {
        statusCode: 200,
        body: 'OK',
    };
    try {

        let sale = {}, likeSubParamCounter = 0, maxCounter = 2, smmServiceID = '', smmOptionsObj = {}, 
        smmResponse = { order: 'no id' }, saleParamsCRM = {}, saleRowParamsCRM = {};
        let smm_api_ok = false; // to be set true when JAP API return good response.
        console.log('form: ', JSON.stringify(form));

        if (isLikeSub(form)) {
            while ((!smm_api_ok) && likeSubParamCounter <= maxCounter) {
                sale = buildSaleObj(form);
                smmServiceID = params["JAP_like-sub_servid_ids"][likeSubParamCounter];
                smmOptionsObj = buildSmmOptions(sale, smmServiceID);

                p(`SMM Options obj:\n`, JSON.stringify(smmOptionsObj));

                try {
                    smmResponse = await rp(smmOptionsObj);
                    p(`Jap order id: ${smmResponse.order}`);
                    smm_api_ok = true; // stop while loop.
                    sale = appendCommentToSaleObj(sale, form, smmResponse.order);
                } catch (error_smm_api) {
                    p(`Error from SMM API: \n`, error_smm_api);
                    likeSubParamCounter++;
                }
            }
            p('sale:\n', sale);
            saleParamsCRM = build_CRM_SaleParams(sale);
            saleRowParamsCRM = build_CRM_SaleRowParams(sale);

            p('Sales parameters');
            p(saleParamsCRM);
            // p(JSON.stringify(saleParamsCRM));
            // p(JSON.stringify(saleRowParamsCRM));
            p(saleRowParamsCRM);
            
            const saleCRM = createSale(saleParamsCRM);
            let saleCRM_Response;

            try {
                saleCRM_Response = await saleCRM.save(null, { useMasterKey: true });
                p('sale id: ', saleCRM_Response.id);
            } catch (error_saleCRM) {
                p(`error on trying to create the sale in the CRM, error:\n`, error_saleCRM);
                responseCB.statusCode = 400;
                responseCB.body = JSON.stringify({
                    message: 'failed',
                    error: error_saleCRM
                });
                cb(null, responseCB);
            }


            saleRowParamsCRM.SaleId.value.id = saleCRM_Response.id;
            const saleRowCRM = createSaleRow(saleRowParamsCRM);
            let saleRowCRM_Response;

            try {
                saleRowCRM_Response = await saleRowCRM.save(null, { useMasterKey: true });
                p('saleRow id: ', saleRowCRM_Response.id);
            } catch (error_saleRowCRM) {
                p(`error on trying to create the saleRow in the CRM, error:\n`, error_saleRowCRM);
                responseCB.statusCode = 400;
                responseCB.body = JSON.stringify({
                    message: 'failed',
                    error: error_saleRowCRM
                });
                cb(null, responseCB);
            }

            responseCB.body = JSON.stringify({
                status: "success",
                info: `sale: ${saleCRM_Response.id}, saleRow: ${saleRowCRM_Response.id}` 
            });
            cb(null, responseCB);
        } else {
            p('if this line in runing its not a like sub');
    
            responseCB.body = JSON.stringify({status: 'success'});
            cb(null, responseCB);
        }


    } catch (error) {
        console.log('an error on try catch main: ', error);
        responseCB.body = JSON.stringify({status: 'error', error: error});
        cb(null, responseCB);
    }
};

function build_CRM_SaleRowParams(sale) {

    let pointerLess = { isPointer: false };
    let isPointer = { isPointer: true };
    let productId = setProperty({}, "id", sale['productId']);
    productId = setProperty(productId, 'table', 'Products');
    
    return {
        Discount: {isPointer: false, value: 0},
        SaleId: {isPointer: true, value: {id: '', table: 'Sales'}},
        Description: {isPointer: false, value: getSaleDescription()},
        Total: setProperty(pointerLess, 'value', sale['price']),
        PricePerUnit: setProperty(pointerLess, 'value', (sale['price']/sale['quantity'])),
        Quantity: setProperty(pointerLess, 'value', sale['quantity']),
        ProductId: setProperty(isPointer, 'value', productId),     
    }
}

function build_CRM_SaleParams(sale) {
    let pointerLess = { isPointer: false };

    return {
        Name: setProperty(pointerLess, 'value', sale['name']),
        Comment: setProperty(pointerLess, 'value', sale['comment']),
        currency: {isPointer: false, value: 'ILS'},
        Total: setProperty(pointerLess, 'value', sale['price']),
        ClosingDate: {isPointer: false, value: new Date()},
        DiscountType: {isPointer: false, value: '%'},
        DiscountValue: {isPointer: false, value: '0'},
        SaleStatusId: {isPointer: true, value: {id: params.saleStatusID_CRM, table: 'SaleStatuses'}},
        Category: {isPointer: true, value: {id: sale['categoryId'], table: 'NameList'}},
        mediaSource: {isPointer: true, value: {id: params.saleMediaSource_CRM, table: 'mediaSourceList'}},
        leadSource: {isPointer: true, value: {id: params.leadSource_CRM, table: 'SourceList'}},
        OwnerId: {isPointer: true, value: {id: params.owenrID_CRM, table: 'User'}},
        AccountId: {isPointer: true, value: {id: params.accountID_CRM, table: 'Accounts'}},
    }
}

function appendCommentToSaleObj(sale, form, orderId) {
    let newSale = sale;
    try {
        newSale['comment'] = `שם הלקוח: ${form['CardOwnerName']},\nטלפון: ${form['InvMobile']},\nמס' חשבונית: ${form['invoicenumber']},\nשם משתמש אינסטגרם: ${form['ReturnData']},\nמספר הזמנה: ${orderId},\nהוזמן מהאתר של JAP`;
        return newSale;
    } catch (error) {
        p('error on appending comment:\n', error);
        return newSale;
    }
}

function getNextMonthString() {
    let today = new Date();
    today.setDate(today.getDate() + 30);
    return `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
}

function isLikeSub(form) {
    if (Object.keys(form).includes('ProdName')) {
        if (form['ProdName'].includes('מנוי לייקים')) {
            return true;
        } else {
            p('Not a likes sub');
            return false;
        }
    } else {
        p(`couldn't find property 'ProdName'`);
        return false;
    }
}

function setProperty(obj, key, value) {
    let newObj = {};
    Object.assign(newObj, obj);
    try {
        newObj[key] = value;
        return newObj;
    } catch (error) {
        p(`error on setProperty, couldn't assign key: ${key}, value: ${value},\n
        obj: ${/*JSON.stringify(obj)*/obj}, error: \n`, error);
        return obj;
    }
}

function buildSaleObj(form) {
    let sale = {};

    sale = setProperty(sale, 'name', 'מנוי לייקים (ישראל)');
    sale = setProperty(sale, 'quantity', form['ProductID']);
    sale = setProperty(sale, 'userName', form['ReturnData']);
    sale = setProperty(sale, 'invoiceNumer', form['invoicenumber']);
    sale = setProperty(sale, 'email', form['UserEmail']);
    sale = setProperty(sale, 'phone', form['InvMobile']);
    sale = setProperty(sale, 'price', form['suminfull']);
    sale = setProperty(sale, 'productId', getProductId(form['ProdName']));
    sale = setProperty(sale, 'categoryId', getCategoryId(form['ProdName']));
    sale = setProperty(sale, 'comment', '');

    return sale;
}

function buildSmmOptions(sale, serviceID) {
    let postData = {};
    const quanNumber = Number(sale['quantity']);

    postData = {
        key: params.JAP_Key,
        action:	'add',
        service: serviceID,
        username: sale['userName'],
        min: (quanNumber - 5) >= 100 ? (quanNumber - 5): quanNumber,
        max: quanNumber + 5,
        posts: 30,
        delay: 0,
        expiry: getNextMonthString()
    };

    return {
        method: 'POST',
        uri: params.JAP_Url,
        form: postData,
        headers: {},
        json: true
    };
}

function getProductId(prodName) {
    // create a full switchCase for like\view\storyView etc..

    if (prodName.includes('מנוי לייקים')) {
        return 'waRyi7uFNF';
    } else {
        return 'jFgnI7vY82'; // מכירה כללית 
    }
}

function getCategoryId(prodName) {
    // create a full switchCase for like\view\storyView etc..

    if (prodName.includes('מנוי לייקים')) {
        return 'TjgIohpaSS';
    } else {
        return '3KjuKDh973'; // מכירה כללית 
    }
}

function getParseObject(className) {
    switch(className) {
        case 'Accounts': 
            return new Accounts();
        case 'SaleRows': 
            return new SaleRows();
        case 'Sales': 
            return new Sales();
    }
}

function createObj(className, params) {
    const object = getParseObject(className);
    Object.keys(params).forEach(key => {
        param = params[key];
        isPointer = param.isPointer;
        paramValue = param.value; // if pointer -> {id:'', table: ''}, if not, value
        // p(param);
        if (isPointer) {
            // p(param);
            const pointer = TABLES[paramValue.table].createWithoutData(paramValue.id); 
            object.set(key, pointer);
        } else {
            object.set(key, paramValue);
        }
    });
    return object;
}

function createSale(params) {
    const sale = createObj('Sales', params);
    return sale;
}

function createSaleRow(params) {
    const saleRow = createObj('SaleRows', params);
    return saleRow;
}

function getSaleDescription() {
    return 'מנוי לייקים חודשי מתחדש';
}
