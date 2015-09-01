var path = require('path')
var dateFormat = require('dateformat')

var fetchMovies = require('./lib/fetchMovies')
var MovieRenderAndWriter = require('./lib/movieRenderAndWriter')

var cacheDirectory = 'tmp'
var now = new Date()
var outputfile = 'out/movie.html'
var timeout = 5000

fetchMovies({
	cacheFile: path.resolve(cacheDirectory, dateFormat(now, 'yyyy-mm-dd_HH') + '.html'),
	timeout: timeout
}).then(function (movies) {
	console.log('fetch success, got ' + movies.length + ' movies')
	console.log('try save to ' + outputfile + ' ...')
	MovieRenderAndWriter(movies, {
		output: outputfile,
		title: dateFormat(now, 'yyyy-mm-dd') + ' Movies',
	})
}, function (err) {
	console.log(err)
})
