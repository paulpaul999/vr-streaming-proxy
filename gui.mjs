import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const GUI = function (spec) {
    const self = {};
    const { provider_manager } = spec; 

    const { app, BrowserWindow, ipcMain, nativeTheme, clipboard } = require('electron');

    const path = require('path');

    const createWindow = function () {
        const win = new BrowserWindow({
            width: 400,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'public', 'electron', 'preload.cjs')
            }
        });

        win.loadFile(path.join(__dirname, 'public', 'electron', 'index.html'));

    };

    app.whenReady().then(() => {
        createWindow()

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow()
            }
        })
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    ipcMain.handle('provider:set-cookies', async function (event, provider_id) {
        console.log('provider:set-cookies', provider_id);
        const clipboard_text = clipboard.readText();
        return await provider_manager.provider(provider_id).set_cookies(clipboard_text);
    });

    ipcMain.handle('gui:state', async function () {
        const state = {
            providers: {
                slr: {
                    status: await provider_manager.provider('slr').get_status()
                }
            }
        };
        return state;
    });
};

export default GUI;