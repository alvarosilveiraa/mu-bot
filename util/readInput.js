'use strict';

const readline = require('readline');

module.exports = question => {
  return new Promise(resolve => {
    console.log('\x1Bc');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}
