const path = require('path');
const log = require('simple-node-logger').createSimpleLogger(path.join(__dirname, '../../application.log'));

if (process.env.MODE !== 'dev') console.log = function () {};

exports.log = log;
