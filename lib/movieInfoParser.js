var cheerio = require('cheerio')

exports.parse = function (html) {
	var $ = cheerio.load(html)
	return $('tbody a').map(function (i, el) {
		return $(el).text()
	})
}