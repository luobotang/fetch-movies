var http = require('http')
var fs = require('fs')
var path = require('path')
var dateFormat = require('dateformat')

var MovieParser = require('./lib/movieParser')
var MovieRenderAndWriter = require('./lib/movieRenderAndWriter')

var WEB_SITE_ROOT = 'http://www.dy2018.com/'
var cacheDirectory = 'tmp'
var now = new Date()
var today = dateFormat(now, 'yyyy-mm-dd')
var currentTime = dateFormat(now, 'yyyy-mm-dd_hh')
var outputfile = 'out/movie.html'

http.get(WEB_SITE_ROOT, function (res) {
	var cacheFileStream = fs.createWriteStream(path.resolve(cacheDirectory, currentTime + '.html'))
	var data = []
	res.on('data', function (chunk) {
		data.push(chunk)
		cacheFileStream.write(chunk)
	})
	res.on('end', function () {
		// 按单字节处理，避免编码问题
		var html = Buffer.concat(data).toString('binary')
		var movies = MovieParser.parse(html)
		MovieRenderAndWriter.renderAndSave(movies, {
			output: outputfile,
			title: today + ' Movies',
			site: WEB_SITE_ROOT.slice(0, -1)
		})
		cacheFileStream.end()
	})
})
