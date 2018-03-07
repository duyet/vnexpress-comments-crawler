var Xray = require('x-ray');
var phantom = require('x-ray-phantom');
var x = Xray();

x('https://vnexpress.net/tin-tuc/phap-luat', '.list_news', [{
  title: '.title_news a',
  // comments: x('.title_news a@href', [{
  //   text: '.comment_item .full_content'
  // }])
}])
  .paginate('#pagination a.next@href')
  .limit(3)
  .write('results.json')