const express = require('express');
const router = express.Router();

const httpProxy = require('http-proxy');
const url = require('url');

const provider_manager = require('../providers/manager');

const proxy = httpProxy.createProxyServer({autoRewrite: true, secure: false, followRedirects: true });

/**
 * Simple proxy strategy inspired by: https://stackoverflow.com/a/26359056
 */

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Host', req.dlna_proxy_host_rewrite);
});

const submit_to_proxy = function (req, res, dest_url) {
  req.url = dest_url

  const dest_url_parsed = new URL(dest_url);
  req.dlna_proxy_host_rewrite = dest_url_parsed.host;

  const options = {
    target: dest_url_parsed.origin,
    secure: false,
    followRedirects: true
  };
  const error_handler = function (err, req, res) {
    console.log("ProxyError:", err);
    return res.sendStatus(404);
  };

  return proxy.web(req, res, options, error_handler);
};

router.get('/url/*', function(req, res, next) {
  const BASE_PATH = "/proxy/url/";
  const dest_url = req.originalUrl.slice(BASE_PATH.length);
  submit_to_proxy(req, res, dest_url);
});

router.get('/stream/:provider_id/:stream_id', function(req, res, next) {
  const provider = provider_manager.provider(req.params.provider_id);
  const dest_url = provider.get_stream_url(req.params.stream_id);
  console.log('dest_url',dest_url);
  submit_to_proxy(req, res, dest_url);
});


module.exports = router;
