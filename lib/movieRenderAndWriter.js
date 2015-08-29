var WEB_SITE_ROOT = 'http://www.dy2018.com/'
var fs = require('fs')

exports.renderAndSave = function (movies, output, title) {
	var outFileStream = fs.createWriteStream(output, {encoding: 'binary'})
	outFileStream.write(new Buffer(
		'<!doctype html>' +
		'<html lang="en">' +
		'<head>' +
		'<meta charset="GBK">' +
		'<link href="movie.css" rel="stylesheet">' +
		'<title>' + title + '</title>' +
		'</head>' +
		'<body>\n' +
		'<ul>\n',
		'binary'
		)
	)

	var site = WEB_SITE_ROOT.slice(0, -1)
	
	movies.forEach(function (movie) {
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