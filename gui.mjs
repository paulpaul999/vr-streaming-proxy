import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const GUI = function () {
    const self = {};
    const { BrowserWindow } = require('electron');
    
    const win = new BrowserWindow({ width: 800, height: 500 })
    // win.loadURL('https://github.com')
    win.loadFile(path.join(__dirname, 'public', 'electron', 'index.html'));
    
    const contents = win.webContents
    // console.log(contents)
    
    // app.quit();

};

export default GUI;