import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const GUI = function () {
    const self = {};

    const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
    const path = require('path')

    const createWindow = function () {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'public', 'electron', 'preload.cjs')
            }
        });

        win.loadFile(path.join(__dirname, 'public', 'electron', 'index.html'));

        ipcMain.handle('dark-mode:toggle', () => {
            if (nativeTheme.shouldUseDarkColors) {
                nativeTheme.themeSource = 'light'
            } else {
                nativeTheme.themeSource = 'dark'
            }
            return nativeTheme.shouldUseDarkColors
        });

        ipcMain.handle('dark-mode:system', () => {
            nativeTheme.themeSource = 'system'
        });
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
};

export default GUI;