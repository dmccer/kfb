var express = require('express');
var http = require('http');
var router = express.Router();
var Apricot = require('apricot').Apricot;
var querystring = require('querystring');
var htmlMinify = require('html-minifier').minify;
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

var fetchFromBaidu = function(opt, callback) {
  var data = {
    yeyouquery: '网页游戏',
    query: '网页游戏',
    pvid: 1412863827569929,
    qid: 1412863827569929,
    zt: 'fc',
    from: 'fc',
    action_from: 4,
    page: 1
      // ipasbdstoken: 'cfcd208495d565ef66e7dff9f98764da'
  };

  http.get({
    host: 'iwan.baidu.com',
    path: '/YeyouAjax/selectOpenserv?' + querystring.stringify(data)
  }, function(_res) {
    _res.setEncoding('utf8');

    var html = '';

    _res.on('data', function(chunk) {
      html += chunk;
    });

    _res.on('end', function() {
      callback(null, html);
    });
  }).on('error', callback);
};

var fetchFrom265g = function(opt, callback) {
  http.get('http://kf.265g.com', function(res) {
    res.setEncoding('binary');

    var html = '';
    // var bufferHelper = new BufferHelper();

    res.on('data', function(chunk) {
      html += chunk;
    });

    res.on('end', function() {
      html = iconv.decode(new Buffer(html, 'binary'), 'gbk');
      console.log(html);

      html = htmlMinify(html, {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: true
      });

      html = html.replace(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/ig, '');
      // html = html.toString().replace(/<script.*>\S*/ig, '');

      Apricot.parse(html, function(err, dom) {
        callback(null, dom.document.querySelector('.mod_tab01 .tab01').outerHTML);
      });
    });
  });

  //try {
  //  Apricot.open('http://kf.265g.com', function(err, dom) {
  //    if (err) {
  //      console.log('aa');
  //    }

  //    res.render('index', {
  //      html: dom.document.querySelector('.mod_tab01 .tab01').outerHTML
  //    });
  //  });
  //} catch (e) {
  //  console.log('dsaf: ', e);
  //}
};

router.get('/kfb', function(req, res) {
  fetchFromBaidu({
    page: req.query.p || 1
  }, function(err, data) {
    if (err) {
      throw err;
    }

    res.json(200, JSON.parse(data));
  });
});

/* GET home page. */
router.get('/', function(req, res) {
  fetchFrom265g(null, function(err, html) {
    res.render('index', {
      title: '开服表',
      html: html
    });
  });
});

module.exports = router;
