var fs = require('fs')
var http = require('http')
var Q = require('q')
var iconv = require('iconv-lite')

var FetchHtml = require('./fetchHtml')
var MovieParser = require('./movieParser')
var MovieInfoParser = require('./movieInfoParser')
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
			Q.allSettled(
				movies.map(function (movie) {
					return FetchHtml(movie.url, ENCODING).then(function (html) {
						movie.detail = MovieInfoParser.parse(html)
					})
				})
			).then(function () {
				d.resolve(movies)
			})
		})
	}).on('error', function (e) {
		d.reject(e)
	})

	return d.promise
}

module.exports = fetchMovies