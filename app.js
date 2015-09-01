var path = require('path')
var dateFormat = require('dateformat')

var fetchMovies = require('./lib/fetchMovies')
var MovieRenderAndWriter = require('./lib/movieRenderAndWriter')

var WEB_SITE_ROOT = 'http://www.dy2018.com/'
var cacheDirectory = 'tmp'
var now = new Date()
var outputfile = 'out/movie.html'
var timeout = 5000

fetchMovies({
	cacheFile: path.resolve(cacheDirectory, dateFormat(now, 'yyyy-mm-dd_hh') + '.html'),
	timeout: timeout
}).then(function (movies) {
	console.log('fetch success, got ' + movies.length + ' movies')
	console.log('try save to ' + outputfile + ' ...')
	MovieRenderAndWriter.renderAndSave(movies, {
		output: outputfile,
		title: dateFormat(now, 'yyyy-mm-dd') + ' Movies',
		site: WEB_SITE_ROOT.slice(0, -1)
	})
}, function (err) {
	console.log(err)
})
