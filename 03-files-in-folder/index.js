const fs = require('fs/promises');
const path = require('path');

const SECRET_FOLDER_PATH = path.join(__dirname, 'secret-folder');

(async () => {
  const items = await fs.readdir(SECRET_FOLDER_PATH,
    { withFileTypes: true, encoding: 'utf-8' });
  const files = items.filter((item) => item.isFile());

  for (const file of files) {
    const filePath = path.resolve(__dirname, SECRET_FOLDER_PATH, file.name);
    const name = file.name.split('.')[0];
    const extName = file.name.split('.')[1];
    const info = await fs.stat(filePath);
    const size = info.size / 1024;
    console.log(`${name} - ${extName} - ${size}kb`);
  }
})();
