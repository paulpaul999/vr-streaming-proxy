import https from 'https';
import http from 'http';

/**
 * Src: https://stackoverflow.com/a/67729663
 * 
 * @param {*} stream 
 * @returns 
 */
export const stream2buffer = function (stream) {
    return new Promise((resolve, reject) => {
        const _buf = [];

        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));
    });
}

export const simple_get = function (url_object) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET'
        };

        const handler = url_object.protocol === 'https:' ? https : http;
        const req = handler.request(url_object, options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            return resolve(stream2buffer(res));
        });

        req.on('error', error => {
            reject(error)
        });

        req.end();
    });
};

if (false) { // CommonJS (require.main === module) {
    const main = async function (params) {
        const buffer = await simple_get(new URL("https://httpbin.org/get"));
        const json = JSON.parse(buffer);
        return json;
    };
    main().then(console.log);
}

// module.exports = { simple_get };