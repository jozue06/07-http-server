'use strict';
const dotenv = require('dotenv').config();
const server = require('./src/app.js');
const PORT = process.env.PORT;

const ENV = {};

ENV.productionApiUrl = 'https://josh-cowsay.herokuapp.com';



server.start( PORT, () => console.log(`Server up on ${PORT}`));