const fs = require('fs');

exports.deleteFile = file => {
  fs.unlink(file, er => {
    if (er) throw new Error(er);
  });
};
