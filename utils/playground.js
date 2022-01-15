const https = require('https');

const submit_to_proxy = function (req, res, dest_url) {
    req.url = dest_url
    const dest_url_parsed = new URL(dest_url);
    const req_options = {
        rejectUnauthorized: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        }
    };

    const request = https.request(dest_url_parsed, req_options, res => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
      
        res.on('data', (d) => {
          process.stdout.write(d);
        });
    });

    request.on('error', error => {
        console.error(error)
    });

    request.end();
    //console.log(request);
};

// submit_to_proxy(1,2, "https://img2.badoink.com/content/scenes/325522/a-roll-in-the-hay-325522.jpg");
//submit_to_proxy(1,2, "https://httpbin.org/get");
submit_to_proxy(1,2, "https://self-signed.badssl.com/");