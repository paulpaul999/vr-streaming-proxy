import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
bodyParserXml(bodyParser);

import logger from 'morgan';

import indexRouter from './routes/index.mjs';
import cd_router from './routes/content_directory.mjs';
import proxy_router from './routes/proxy_router.mjs';

/* Providers */
import provider_manager from './providers/manager.mjs';
import provider_czechvr from './providers/czechvr.mjs';
provider_manager.register(provider_czechvr);
import provider_czechvr_free from './providers/czechvr_free.mjs';
provider_manager.register(provider_czechvr_free);
import provider_slr_poc from './providers/slr_poc.mjs';
provider_manager.register(provider_slr_poc);

/* Express */
var app = express();

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ContentDirectory', bodyParser.xml(), cd_router);
app.use('/proxy', proxy_router)

/* ----------------- Electron ------------------ */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { BrowserWindow } = require('electron');

const win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('https://github.com')

const contents = win.webContents
// console.log(contents)

/* --------------------------------------------- */


export default app;
