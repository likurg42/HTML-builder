const fs = require('fs');
const path = require('path');

const FILES_PATH = path.join(__dirname, 'files');
const FILES_COPY_PATH = path.join(__dirname, 'files-copy');

const cleanFiles = async (dir) => {
  const items = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isFile()) {
      await fs.promises.unlink(path.join(dir, item.name));
    } else {
      await cleanFiles(path.join(dir, item.name));
      await fs.promises.rmdir(path.join(dir, item.name));
    }
  }
};

const copyFiles = async (from, to) => {
  try {
    await fs.promises.access(to);
    await cleanFiles(to);
  } catch (err) {
    await fs.promises.mkdir(to);
  }

  const items = await fs.promises.readdir(from, { withFileTypes: true });
  for (let item of items) {
    if (item.isFile()) {
      fs.createReadStream(path.join(from, item.name))
        .pipe(fs.createWriteStream(path.join(to, item.name)));
    } else {
      await copyFiles(path.join(from, item.name), path.join(to, item.name));
    }
  }
};

(async () => {
  await copyFiles(FILES_PATH, FILES_COPY_PATH);
})();
