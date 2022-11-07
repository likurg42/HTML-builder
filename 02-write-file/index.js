const fs = require('node:fs');
const path = require('node:path');

const { stdin: input, stdout: output, exit } = process;
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  'utf-8');

input.pipe(writableStream);

input
  .on('data', (data) => {
    if (data.toString().trim() === 'exit') {
      exit();
    } else {
      output.write('Введите еще текст: ');
    }
  });

process
  .on('init', () => {
    output.write('Введите текст: ');
  })
  .on('SIGINT', () => {
    exit();
  })
  .on('exit', () => {
    output.write('\nПрощай');
  });

process.emit('init');
