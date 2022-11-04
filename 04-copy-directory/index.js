const path = require('path');
const { readdir, copyFile, rm, mkdir } = require('fs/promises');

const folder = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');

async function createFolder() {
   await mkdir(copiedFolder, { recursive: true }, err => {
    if (err) {
        console.log(err);
    }
  });
  console.log('Папка создана');
}

async function copyFiles() {
    try {
        const content = await readdir(folder);
        content.forEach( async file => {
            const origPath = path.join(__dirname, 'files', file);
            const copyPath = path.join(__dirname, 'files-copy', file);
            await copyFile(origPath, copyPath);
            console.log(`скопировано ${file}`);
        });
      } catch (err) {
        console.error(err);
      }
}

async function deleteFolder() {
    await rm(copiedFolder, { recursive: true }, err => {
        if (err) {
            console.log(err);
        }
    });
    //console.log('Папка удалена');
    createFolder();
    copyFiles();
}

async function copyDir() {
    if (copiedFolder) {
        deleteFolder();
    } else {
      createFolder();
      copyFiles();
    }
};

copyDir();