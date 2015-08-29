var fs = require('fs')

exports.renderAndSave = function (movies, options) {
	var output = options.output
	var title = options.title
	var site = options.site

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

	var site = 
	
	movies.forEach(function (movie) {
		outFileStream.write(new Buffer(
			'<li>' +
				'<a href="' + site + movie.url + '" target="_blank">' + movie.name + '</a>' +
			'</li>\n',
			'binary'
			)
		)
	})

	outFileStream.write(new Buffer(
		'</ul>' +
		'</body>' +
		'</html>',
		'binary'
		)
	)

	outFileStream.end()
}