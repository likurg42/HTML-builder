const fs = require('fs');
const path = require('path');

const buildPage = async () => {
  const ASSETS_PATH = path.join(__dirname, 'assets');
  const STYLES_PATH = path.join(__dirname, 'styles');
  const COMPONENTS_PATH = path.join(__dirname, 'components');
  const PROJECT_DIST_PATH = path.join(__dirname, 'project-dist');
  const PROJECT_DIST_ASSETS_PATH = path.join(PROJECT_DIST_PATH, 'assets');

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

  const mergeCSS = async (location) => {
    const resultCssPath = path.join(PROJECT_DIST_PATH, 'style.css');

    fs.access(resultCssPath, async (err) => {
      if (err === null) {
        await fs.promises.unlink(resultCssPath);
      }
    });

    const files = await fs.promises.readdir(location);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const writableStream = fs.createWriteStream(resultCssPath);
    for (const cssFile of cssFiles) {
      const cssFilePath = path.join(location, cssFile);
      const readableStream = fs.createReadStream(cssFilePath, 'utf-8');
      readableStream.on('data', (data) => {
        writableStream.write(`${data.toString()}\n`);
      });
    }
  };

  const mergeComponents = async (componentsPath) => {
    const resultHTMLPath = path.join(PROJECT_DIST_PATH, 'index.html');
    const resultHTMLWritableStream = fs.createWriteStream(resultHTMLPath,
      'utf-8');
    const templatePath = path.join(__dirname, 'template.html');
    let templateData = await fs.promises.readFile(templatePath, 'utf-8');

    while (templateData.indexOf('{') !== -1) {
      const start = templateData.indexOf('{{');
      const end = templateData.indexOf('}}');
      const componentName = templateData.slice(start + 2, end);
      const componentData = await fs.promises.readFile(
        path.join(componentsPath, `${componentName}.html`),
        'utf-8'
      );
      templateData =
        templateData.replace(`{{${componentName}}}`, `\n${componentData}\n`);

    }

    resultHTMLWritableStream.write(templateData);
  };

  try {
    await fs.promises.access(PROJECT_DIST_PATH);
  } catch (err) {
    await fs.promises.mkdir(PROJECT_DIST_PATH);
  }

  await copyFiles(ASSETS_PATH, PROJECT_DIST_ASSETS_PATH);
  await mergeCSS(STYLES_PATH);
  await mergeComponents(COMPONENTS_PATH);
};

buildPage();
