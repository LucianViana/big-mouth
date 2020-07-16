'use strict';

const co      = require('co');
const AWS     = require('aws-sdk');
AWS.config.region = 'us-east-1';
const cognito = new AWS.CognitoIdentityServiceProvider();
//TODO: NAO FUNCIONOU A PASSAGEM AUTOMATICA DE USERNAME E PASSWORD ESTUDAR E NAO LIBERAR PARA PRODUCAO NO GIT PARA NAO EXIBIR A SENHA
let an_authenticated_user = function* (user) {
  let req = {
    UserPoolId: process.env.cognito_user_pool_id,
    Username: "root"//user.username
  };
  yield cognito.adminDeleteUser(req).promise();
  
  console.log(`[${user.username}] - user deleted`);
};

module.exports = {
  an_authenticated_user
};