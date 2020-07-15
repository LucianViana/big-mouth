'use strict';

const co = require('co');
const Promise = require('bluebird');
const aws4 = Promise.promisifyAll(require('../../lib/aws4'));

let initialized = false;

let init = co.wrap( function* () {
    if  (initialized) {
        return;
    }

    process.env.restaurants_api = "https://1kkc3zmmvf.execute-api.us-east-1.amazonaws.com/dev/restaurants";
    process.env.restaurants_table = "restaurants";
    process.env.AWS_REGION = "us-east-1";

    process.env.cognito_client_id = "1ujbc6u8ddu6g7upvag7mo4att";
    process.env.cognito_user_pool_id = "us-east-1_kUaGlvbW2";
    process.env.cognito_server_client_id = "dqgi9u25aupldouuujmkikpf5";
    
    yield aws4.init();

    initialized = true;
})

module.exports.init = init;

















