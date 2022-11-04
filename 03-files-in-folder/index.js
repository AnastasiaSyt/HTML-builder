
const path = require('path');
const fs = require('fs');
const { readdir, stat } = require('fs/promises');

const secretFolder = path.join(__dirname, 'secret-folder');

function getSize(ext) {
    return (ext / 1024).toFixed(3);
}

async function readFiles() {
    try {
        const files = await readdir(secretFolder);
        files.forEach(async (file) => {
            const pathFile = path.join(secretFolder, file);
            const statsFile = stat(pathFile);

            const fileName = path.basename(pathFile);
            const extension = path.extname(pathFile).slice(1);
            const fileNameClear = fileName.replace(extension, '').replace('.', '');

            const fileSize = (await statsFile).size;
            const sizeKb = getSize(fileSize);
            
            if ((await statsFile).isFile()) {
                console.log(`${fileNameClear} - ${extension} - ${sizeKb} Kb`);
            }
        });
      } catch (err) {
        console.error(err);
      }
}

readFiles();

    




