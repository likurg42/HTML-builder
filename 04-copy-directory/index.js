const fs = require('fs');
const path = require('path');

(async () => {
  const FILES_PATH = path.join(__dirname, 'files');
  const FILES_COPY_PATH = path.join(__dirname, 'files-copy');

  fs.access(FILES_COPY_PATH, async (err) => {
    if (err) {
      console.log('not exist');
      // console.error(err);
      await fs.promises.mkdir(FILES_COPY_PATH);
    }
  });

  const files = await fs.promises.readdir(FILES_PATH);
  const copyFiles = await fs.promises.readdir(FILES_COPY_PATH);

  for (const copyFile of copyFiles) {
    if (!files.includes(copyFile)) {
      await fs.promises.unlink(path.join(FILES_COPY_PATH, copyFile));
    }
  }

  files.forEach((file) => {
    fs.createReadStream(path.join(__dirname, 'files', file))
      .pipe(fs.createWriteStream(path.join(__dirname, 'files-copy', file)));
  });

})();
