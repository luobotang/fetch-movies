var http = require('http')
var Q = require('q')
var iconv = require('iconv-lite')

var count = 0
var max = 20

/*
 * 'GET' HTML
 * @param {string} url
 * @param {function} callback - callback(err, buffHtml)
 */
function getHtml(url, callback) {
	http.get(url, function (res) {
		var data = []
		res.on('data', function (chunk) {
			data.push(chunk)
		})
		res.on('end', function () {
			callback(null, Buffer.concat(data))
		})
	}).on('error', function (e) {
		callback(e)
	})
}

module.exports = function (url, encoding) {
	var d = Q.defer()

	count++
	if (count > max) {
		d.reject()
		return d.promise
	}

	getHtml(url, function (err, buff) {
		if (err) {
			d.reject(err)
		} else {
			console.log('fetch ' + url + ' done')
			d.resolve(iconv.decode(buff, encoding))
		}
	})

	return d.promise
}