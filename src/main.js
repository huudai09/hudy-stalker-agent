const path = require('path');
const { signin } = require('./libs/signin');
const { log } = require('./libs/log');
const { run } = require('./libs/stalker');

exports.start = () => {
  signin(path.join(__dirname, '../config'))
    .then((config) => {
      run(config);
    })
    .catch((err) => {
      log.info(err);
    });
};
