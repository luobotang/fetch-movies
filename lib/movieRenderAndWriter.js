var fs = require('fs')

var HTML_HEAD = function (title) {
	return '<!doctype html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<link href="movie.css" rel="stylesheet">' +
	'<title>' + title + '</title>' +
	'</head>' +
	'<body>\n' +
	'<ul>\n'
}

var renderMovie = function (movie) {
	return (
		'<li>' +
			'<a href="' + movie.url + '" target="_blank">' + movie.name + '</a>' +
		'</li>\n'
	)
}

var HTML_FOOT =
	'</ul>' +
	'</body>' +
	'</html>'

module.exports = function (movies, options) {
	fs.writeFile(options.output,
		HTML_HEAD(options.title) +
			movies.map(renderMovie).join('') +
		HTML_FOOT
	)
}
