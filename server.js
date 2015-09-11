var app = require('connect')()
var serveStatic = require('serve-static')

var PORT = 8080

app
.use('/getAllMovie', getAllMovies)
.use('/getMovie', getMovie)
.use(serveStatic('out', {
	index: ['movie.html']
})).listen(PORT)

function getAllMovies(req, res, next) {
	// todo
	next()
}

function getMovie(req, res, next) {
	// todo
	next()
}

console.log('server started on port: ' + PORT)