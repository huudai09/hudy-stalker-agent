const fs = require('fs');
const sloc = require('sloc');

exports.getLoc = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', function (err, code) {
      if (err) {
        resolve({
          total: null,
          comment: null,
        });
      } else {
        const { total, comment } = sloc(code, 'js');

        resolve({
          total,
          comment,
        });
      }
    });
  });
};
