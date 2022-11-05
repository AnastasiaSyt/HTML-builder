const path =require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

const sourceFolder = path.join(__dirname, 'styles');
const finalFolder = path.join(__dirname, 'project-dist','bundle.css');

async function mergeStyles() {
  try {
    const content = await readdir(sourceFolder, { withFileTypes: true });
    let arr = [];

    for (let file of content) {
      //console.log(file);
      const style = file.name;
      const extension = style.substring(style.length - 3);
      const styleFilePath = path.join(sourceFolder, `${style}`);
      
      if (file.isFile() && extension === 'css') {
        arr.push(await readFile(styleFilePath));
        await writeFile(finalFolder, arr);
      }
    } 
  } catch (err) {
    console.log(err);
  }
};

mergeStyles();
