var fs = require('fs')
var jade = require('jade')

var jadeTemplate = 
'doctype html\n' +
'html\n' +
'  head\n' +
'    meta(charset="UTF-8")\n' +
'    title= title\n' +
'    link(href="movie.css" rel="stylesheet")\n' +
'  body\n' +
'    ul\n' +
'      each movie in movies\n' +
'        li\n' +
'          a(href="#{movie.url}" target="_blank")= movie.name\n'

module.exports = function (movies, options) {
	try {
		var html = jade.render(jadeTemplate, {
			title: options.title,
			movies: movies,
			pretty: ' '
		})
	} catch (e) {
		console.log(e)
	}
	fs.writeFile(options.output, html)
}
