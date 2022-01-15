var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var cd_router = require('./routes/content_directory');
var proxy_router = require('./routes/proxy_router');

/* Providers */
const provider_manager = require('./providers/manager');
const provider_slr = require('./providers/slr');
provider_manager.register(provider_slr);

/* Express */
var app = express();

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ContentDirectory', cd_router);
app.use('/proxy', proxy_router)

module.exports = app;
