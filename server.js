var app = require('connect')()
var serveStatic = require('serve-static')

var PORT = 8080

app
.use('/getAllMovie', getAllMovies)
.use('/getMovie', getMovie)
.use(serveStatic('app', {
	index: ['index.htm']
})).listen(PORT)

function getAllMovies(req, res, next) {
	// todo
}

function getMovie(req, res, next) {
	// todo
}

console.log('server started on port: ' + PORT)