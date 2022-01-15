var express = require('express');
var router = express.Router();

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({hostRewrite: "trailers.czechvr.com"});

const url = require('url');

/**
 * Simple proxy strategy inspired by: https://stackoverflow.com/a/26359056
 */

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Host', req.dlna_proxy_host_rewrite);
});

const submit_to_proxy = async function (req, res, dest_url) {
  req.url = dest_url

  const dest_url_parsed = new URL(dest_url);
  req.dlna_proxy_host_rewrite = dest_url_parsed.host;

  const options = { target: dest_url_parsed.origin, secure: false };
  const error_handler = async function (err, req, res) {
    return res.sendStatus(404);
  };

  return proxy.web(req, res, options, error_handler);
};

router.get('/url/*', function(req, res, next) {
  const BASE_PATH = "/proxy/url/";
  const dest_url = req.originalUrl.slice(BASE_PATH.length);
  submit_to_proxy(req, res, dest_url);
});

router.get('/stream/:studio/:scene', function(req, res, next) {
  const dest_url = "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_2160p_60fps_stereo_abl.mp4";
  submit_to_proxy(req, res, dest_url);
});


module.exports = router;
