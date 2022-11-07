const fs = require('fs');
const path = require('path');

const TEXTPATH = path.join(__dirname, 'text.txt');
const text = fs.createReadStream(TEXTPATH, 'utf-8');

text
  .on('data', (chunk) => {
    process.stdout.write(chunk);
  })
  .on('err', (err) => {
    if (err) {
      throw err;
    }
  });
