var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

var logger = require('morgan');

var indexRouter = require('./routes/index');
var cd_router = require('./routes/content_directory');
var proxy_router = require('./routes/proxy_router');

/* Providers */
const provider_manager = require('./providers/manager');
const provider_czechvr = require('./providers/czechvr');
provider_manager.register(provider_czechvr);
const provider_czechvr_free = require('./providers/czechvr_free');
provider_manager.register(provider_czechvr_free);
const provider_slr_poc = require('./providers/slr_poc');
provider_manager.register(provider_slr_poc);

/* Express */
var app = express();

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ContentDirectory', bodyParser.xml(), cd_router);
app.use('/proxy', proxy_router)

module.exports = app;
