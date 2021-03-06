import express from 'express';
const router = express.Router();

import https from 'https';

import provider_manager from '../providers/manager.mjs';
import proxify from '../utils/proxify.mjs';


router.get('/url/*', function(req, res, next) {
  const BASE_PATH = "/proxy/url/";
  const dest_url_encoded = req.originalUrl.slice(BASE_PATH.length);
  const dest_url = decodeURIComponent(dest_url_encoded);
  proxify.proxify_request(req, res, dest_url);
});

router.get('/stream/:provider_id/:stream_id', async function(req, res, next) {
  const provider = provider_manager.provider(req.params.provider_id);
  const dest_url = await provider.get_stream_url(req.params.stream_id);
  console.log('dest_url',dest_url);
  proxify.proxify_request(req, res, dest_url);
});


export default router;
