const path = require("path");
const {
  readdir,
  readFile,
  writeFile,
  mkdir,
  copyFile,
  rm,
} = require("fs/promises");

const templatePath = path.join(__dirname, "template.html");
const htmlPath = path.join(__dirname, "project-dist", "index.html");
const componentsPath = path.join(__dirname, "components");
//console.log(componentsPath);

async function readComponents(template) {
  const components = await readdir(componentsPath, { withFileTypes: true });
  try {
    for (let file of components) {
      const componentName = file.name;
      const templateName = componentName.split(".")[0];
      // console.log(componentName);
      // console.log(templateName);
      const currentComponent = await readFile(
        path.join(componentsPath, componentName),
        "utf-8"
      );
      template = template.replace(`{{${templateName}}}`, currentComponent);
    }
  } catch (e) {
    console.log(e);
  }
  return template;
}

async function teplateAdd() {
  const template = await readFile(templatePath, "utf-8");
  //console.log(template);
  const newTemplate = await readComponents(template);
  await createFolder(path.join(__dirname, "project-dist"));
  await writeFile(htmlPath, newTemplate);
}

teplateAdd();

const sourceStyle = path.join(__dirname, "styles");
const finalStyle = path.join(__dirname, "project-dist", "style.css");

async function mergeStyles() {
  try {
    const content = await readdir(sourceStyle, { withFileTypes: true });
    const arr = [];
    for (let file of content) {
      //console.log(file);
      const style = file.name;
      const extension = style.substring(style.length - 3);
      const styleFilePath = path.join(sourceStyle, `${style}`);

      if (file.isFile() && extension === "css") {
        arr.push(await readFile(styleFilePath));
      }
    }
    await writeFile(finalStyle, arr);
  } catch (err) {
    console.log(err);
  }
}

mergeStyles();

const assetsFolder = path.join(__dirname, "assets");
const copiedFolder = path.join(__dirname, "project-dist", "assets");

async function createFolder(folderName) {
  await mkdir(folderName, { recursive: true });
}

async function copyFiles(firstPath, secondPath) {
  const sourcePath = firstPath ? firstPath : assetsFolder;
  const targetPath = secondPath ? secondPath : copiedFolder;
  try {
    const content = await readdir(sourcePath, { withFileTypes: true });
    for (let file of content) {
      const name = file.name;
      if (file.isDirectory()) {
        const sourceDirectory = path.join(sourcePath, name);
        const targetDirectory = path.join(targetPath, name);
        await createFolder(targetDirectory);
        await copyFiles(sourceDirectory, targetDirectory);
      } else {
        const sourceFile = path.join(sourcePath, name);
        const targetFile = path.join(targetPath, name);
        await copyFile(sourceFile, targetFile);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteFolder() {
  try {
    await rm(copiedFolder, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (e) {
    console.log(e);
  }

  //console.log('Папка удалена');
  await createFolder(copiedFolder);
  await copyFiles();
}

async function copyDir() {
  try {
    if (copiedFolder) {
      deleteFolder();
    } else {
      await createFolder(copiedFolder);
      await copyFiles();
    }
  } catch (e) {
    console.log(e);
  }
}

copyDir();
