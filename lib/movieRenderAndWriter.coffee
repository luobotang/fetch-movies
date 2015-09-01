fs = require('fs')
jade = require('jade')

jadeTemplate =
'''
doctype html
html
  head
    meta(charset="UTF-8")
    title= title
    link(href="movie.css" rel="stylesheet")
  body
    ul
      each movie in movies
        li
          a(href="#{movie.url}" target="_blank")= movie.name
'''

module.exports = (movies, options) ->
	try
		html = jade.render jadeTemplate,
			title: options.title
			movies: movies
			pretty: ' '
	catch e
		console.log(e)

	fs.writeFile(options.output, html)

