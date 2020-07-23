'use strict';

const co = require('co');
const Promise = require('bluebird');
const aws4 = require('../../lib/aws4');

let initialized = false;

let init = co.wrap(function* () {
  if (initialized) {
    return;
  }

  process.env.restaurants_api = "https://jd7pkw0jq1.execute-api.us-east-1.amazonaws.com/dev/restaurants";
  process.env.restaurants_table = "restaurants";
  process.env.AWS_REGION = "us-east-1";
  process.env.cognito_client_id = "7br7vfeet8pqlc1lqgj34j1g6l";
  process.env.cognito_user_pool_id = "us-east-1_92XbyMCWD";
  process.env.cognito_server_client_id = "2dtu4ib1oq2pr1vii9lr8uiujb";

  yield aws4.init();

  initialized = true;
});

module.exports.init = init;