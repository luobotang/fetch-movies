var fs = require('fs')
var http = require('http')
var Q = require('q')
var iconv = require('iconv-lite')

var MovieParser = require('./movieParser')
var WEB_SITE_ROOT = 'http://www.dy2018.com/'
var ENCODING = 'GBK'

function fetchMovies(options) {
	var d = Q.defer()

	if (options && options.cacheFile) {
		var cacheFileStream = fs.createWriteStream(options.cacheFile)
	}

	http.get(WEB_SITE_ROOT, function (res) {
		var data = []
		res.on('data', function (chunk) {
			if (cacheFileStream) cacheFileStream.write(chunk)
			data.push(chunk)
		})
		res.on('end', function () {
			if (cacheFileStream) cacheFileStream.end()
			// 按单字节处理，避免编码问题
			var html = iconv.decode(Buffer.concat(data), ENCODING)
			var movies = MovieParser.parse(html, WEB_SITE_ROOT)
			d.resolve(movies)
		})
	}).on('error', function (e) {
		d.reject(e)
	})

	if (options && options.timeout) {
		setTimeout(function () {
			d.reject('TIMEOUT')
		}, options.timeout)
	}

	return d.promise
}

module.exports = fetchMovies