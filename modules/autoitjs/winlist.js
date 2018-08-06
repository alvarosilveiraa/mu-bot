const path = require('path');
const exec = require('child_process').exec;

module.exports = szTitle => {
  return new Promise((resolve, reject) => {
    exec(path.join(__dirname, './winlist.exe'), (err, stdout, stderr) => {
      if(err) return reject();
      const list = [];
      const data = stdout.trim();
      const parse = data.split('|[~_~]|');
      parse.forEach(item => {
        if(item.indexOf('[~_~]') !== -1) {
          const options = item.split('[~_~]');
          if(options.length > 1) {
            if(!szTitle || options[0] === szTitle) {
              list.push({
                title: options[0],
                handle: Number(options[1])
              });
            }
          }
        }
      });
      resolve(list);
    });
  });
}
