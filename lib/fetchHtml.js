var http = require('http')
var Q = require('q')
var iconv = require('iconv-lite')

var count = 0
var max = 20

module.exports = function (url, encoding) {
	var d = Q.defer()

	count++
	if (count > max) {
		d.reject()
		return d.promise
	}

	http.get(url, function (res) {
		var data = []
		res.on('data', function (chunk) {
			data.push(chunk)
		})
		res.on('end', function () {
			var html = iconv.decode(Buffer.concat(data), encoding)
			console.log('fetch ' + url + ' done')
			d.resolve(html)
		})
	}).on('error', function (e) {
		d.reject(e)
	})

	return d.promise
}