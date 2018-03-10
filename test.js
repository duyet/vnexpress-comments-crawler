var url = "https://usi-saas.vnexpress.net/index/get?callback=okmen&offset=0&limit=1000&frommobile=0&sort=like&objectid=3721097&objecttype=1&siteid=1000000&categoryid=1001007&usertype=4&template_type=1";
var dest = "./data/test_download.js";


var fs = require('fs');
var request = require('request');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var sendReq = request.get(url);

    // verify response code
    sendReq.on('response', function(response) {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }
    });

    // check for request errors
    sendReq.on('error', function (err) {
        fs.unlink(dest);
        return cb(err.message);
    });

    sendReq.pipe(file);

    file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
    });

    file.on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        return cb(err.message);
    });
};

download(url, dest)