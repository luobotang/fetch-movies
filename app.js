var http = require('http')
var fs = require('fs')
var path = require('path')
var dateFormat = require('dateformat')

var MovieParser = require('./lib/movieParser')

var WEB_SITE_ROOT = 'http://www.dy2018.com/'
var cacheDirectory = 'tmp'
var now = new Date()
var today = dateFormat(now, 'yyyy-mm-dd')
var currentTime = dateFormat(now, 'yyyy-mm-dd_hh')

http.get(WEB_SITE_ROOT, function (res) {
	var cacheFileStream = fs.createWriteStream(path.resolve(cacheDirectory, currentTime + '.html'))
	var data = []
	res.on('data', function (chunk) {
		data.push(chunk)
		cacheFileStream.write(chunk)
	})
	res.on('end', function () {
		findAndSaveMovies(Buffer.concat(data))
		cacheFileStream.end()
	})
})

function findAndSaveMovies(buffer) {
	var outFileStream = fs.createWriteStream('out/movie.html', {encoding: 'binary'})
	outFileStream.write(new Buffer(
		'<!doctype html>' +
		'<html lang="en">' +
		'<head>' +
		'<meta charset="GBK">' +
		'<link href="movie.css" rel="stylesheet">' +
		'<title>Movies - ' + today + '</title>' +
		'</head>' +
		'<body>\n' +
		'<ul>\n',
		'binary'
		)
	)

	var site = WEB_SITE_ROOT.slice(0, -1)
	
	MovieParser.parse(buffer.toString('binary')) // 按单字节处理，避免编码问题
	.forEach(function (movie) {
		outFileStream.write(new Buffer(
			'<li>' +
				'<a href="' + site + movie.url + '" target="_blank">' + movie.name + '</a>' +
			'</li>\n',
			'binary'
			)
		)
	})

	outFileStream.end(new Buffer(
		'</ul>' +
		'</body>' +
		'</html>',
		'binary'
		)
	)
}
