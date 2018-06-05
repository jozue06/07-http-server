'use strict';
const dotenv = require('dotenv').config();
const server = require('./src/app.js');
const PORT = process.env.PORT;

const ENV = {};

ENV.isProduction = window.location.protocol.includes('the-spot-sea');
console.log('ENV.isProduction', ENV.isProduction);

ENV.productionApiUrl = 'https://the-spot-sea.herokuapp.com';
ENV.developmentApiUrl = 'http://localhost:3000';
ENV.apiUrl = ENV.isProduction ? ENV.productionApiUrl : ENV.developmentApiUrl;
console.log('apiURL', ENV.apiUrl);

server.start( PORT, () => console.log(`Server up on ${PORT}`));