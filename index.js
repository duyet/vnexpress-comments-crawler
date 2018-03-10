var Xray = require('x-ray');
var fs = require('fs');
var request = require('request');

// Thank you: https://stackoverflow.com/a/32134846/4749668
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


var x = Xray({
	filters: {
		trim: function (value) {
			return typeof value === 'string' ? value.trim() : value
		}
	}
});

x('https://vnexpress.net/tin-tuc/phap-luat', '.list_news', [{
  title: '.title_news a | trim',
  url: '.title_news a@href',
  detail: x('.title_news a@href', {
    title: 'title',
    tt_site_id: '[name="tt_site_id"]@content',
    tt_category_id: '[name="tt_category_id"]@content',
    tt_article_id: '[name="tt_article_id"]@content',
    tt_page_type: '[name="tt_page_type"]@content',
    box_comment_vne: '#box_comment_vne@data-component-value'
  })
}])
  .paginate('#pagination a.next@href')
  .limit(50)
  ((err, res) => {
    for (var i in res) {
    	var comment_params = {
    		callback: 'okmen',
    		offset: 0,
    		limit: 1000,
    		frommobile: 0,
    		sort: 'like',
    		objectid: res[i].detail.tt_article_id,
    		objecttype: 1,
    		siteid: res[i].detail.tt_site_id,
    		categoryid: res[i].detail.tt_category_id,
    		// sign: 'c1b4a991efb5df86389ae97b7fcb3ae6',
    		usertype: 4,
    		template_type: 1,
    	};
    	var url_param = Object.keys(comment_params).map(function(k) {
		    return k + '=' + comment_params[k]
		}).join('&');
    	var comment_url = `https://usi-saas.vnexpress.net/index/get?` + url_param;
    	console.log(comment_url)
    	download(comment_url, './data/' + res[i].detail.tt_article_id + '.js');
    }
  })
  .write('results.json')


