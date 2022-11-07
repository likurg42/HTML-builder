const fs = require('fs');
const path = require('path');

const STYLES_PATH = path.join(__dirname, 'styles');
const PROJECT_DIST_PATH = path.join(__dirname, 'project-dist');
const BUNDLE_PATH = path.join(PROJECT_DIST_PATH, 'bundle.css');

(async () => {
  const files = await fs.promises.readdir(STYLES_PATH);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  let css = '';
  for (const file of cssFiles) {
    const filePath = path.join(STYLES_PATH, file);
    const readStream = fs.createReadStream(filePath, 'utf-8');
    const writeStream = fs.createWriteStream(BUNDLE_PATH);
    readStream.on('data', (data) => {
      css += data.toString();
      writeStream.write(css);
    });
  }
})();
