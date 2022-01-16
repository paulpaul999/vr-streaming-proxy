const https = require('https');
const http = require('http');

const { pipeline } = require('stream');

const HTTPS_REJECT_UNAUTHORIZED = false;

const filter_object = function (object, keys_whitelist) {
    const result = {};
    keys_whitelist.forEach(key => {
        const value = object[key];
        if (value !== undefined) {
            result[key] = value;
        }
    });
    return result;
};

const PASSTHROUGH_REQ_HEADERS = [
    /* Basic headers */
    'accept-encoding',
    'user-agent',

    /* Range requests */
    'range',
    'if-range',

    /* Misc */
    'date',
    'if-match',
    'if-none-match',
    'if-modified-since',
    'if-unmodified-since',
];

const PASSTHROUGH_RES_HEADERS = [
    /* Basic headers */
    'content-encoding',
    'content-length',
    'content-type',
    'content-disposition',

    /* Range requests */
    'accept-ranges',
    'content-range',

    /* Misc */
    'date',
    'etag',
    'last-modified',
];

/**
 * Simple Proxy to serve a given URL.
 * 
 * Model: 
 *   [Client]               [Proxy]                     [Server]
 *      |                      |                            |
 *      | ----- request -----> |                            |
 *      |                      | ------ proxy_request ----> |
 *      |                      | <---- server_response ---- |
 *      | <---- response ----- |                            |
 *      |                      |                            |
 * 
 * Traits:
 *   - Stateless
 *   - Basic HTTP headers are passed through
 *   - No Cookies support
 * 
 * @param {http.IncomingMessage} req - Node.js standard req object
 * @param {http.ServerResponse} res - Node.js standard res object
 * @param {String} url - URL to fetch from server
 */
const proxify_request = function (req, res, url) {
    //req.url = dest_url
    const url_parsed = new URL(url);

    const proxy_request_headers = filter_object(req.headers, PASSTHROUGH_REQ_HEADERS);
    proxy_request_headers['user-agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";

    const proxy_request_options = {
        rejectUnauthorized: HTTPS_REJECT_UNAUTHORIZED,
        headers: proxy_request_headers,
    };

    const handler = url_parsed.protocol === 'https:' ? https : http;
    const proxy_request = handler.request(url_parsed, proxy_request_options, server_response => {
        console.log('statusCode:', server_response.statusCode);
        console.log('headers:', server_response.headers);

        const res_code = server_response.statusCode;
        const res_headers = filter_object(server_response.headers, PASSTHROUGH_RES_HEADERS);
        res.writeHead(res_code, res_headers);
        
        pipeline(
            server_response,
            res,
            err => {
                if (err)
                    console.error('Premature close. Or Pipeline failed.', err);
                else
                    console.log('Pipeline succeeded.');
            }
        );
        
        // res.on('data', (d) => {
        //   process.stdout.write(d);
        // });
    });

    proxy_request.on('error', error => {
        console.error(error)
    });

    proxy_request.end();
};

const server = http.createServer(function (req, res) {
    let url = "https://trailers.czechvr.com/czechvr/videos/download/468/468-czechvr-3d-7680x3840-60fps-oculusrift_uhq_h265-fullvideo-1.mp4";
    proxify_request(req, res, url);
});
  
server.listen(3000);

// submit_to_proxy(1,2, "https://img2.badoink.com/content/scenes/325522/a-roll-in-the-hay-325522.jpg");
// submit_to_proxy(1,2, "https://www.czechvr.com/category/1816-a-sweet-surprise-468-cvr/468-czechvr-big.jpg");
// submit_to_proxy(1,2, "https://httpbin.org/get");
// submit_to_proxy(1,2, "http://httpbin.org/get");
// submit_to_proxy(1,2, "https://self-signed.badssl.com/");

/**
 * TODO:
 * - Streamify https://stackoverflow.com/a/46146154 maybe Pipeline? https://stackoverflow.com/q/58875655
 * - Headers: https://nodejs.org/api/http.html#responsewriteheadstatuscode-statusmessage-headers
 * - Passthrough Content Type Headers
 * - Passthrough Content-Length
 * - Passthrough Range request headers -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
 *     -> Response Code 206 -> also pass other response codes?
 * - Passthrough gunzip encoding stuff? maybe not? src: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
 * - Cherrypick dicts https://stackoverflow.com/a/1098955
 * - Follow Redirects without lib: https://stackoverflow.com/a/45777753
 */