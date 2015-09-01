var cheerio = require('cheerio')

function getAllMovies(html, site) {
	var $ = cheerio.load(html)
	var movies = []
	site = site.slice(0, -1)
	$('a').each(function (i, el) {
		var title = $(el).attr('title')
		var href = $(el).attr('href')
		if (href && title) {
			movies.push({
				name: title,
				url: site + href // 完整路径
			})
		}
	})
	return dedupMovies(movies)
}

/*
 * 依据电影的页面路径，去除重复电影
 */
function dedupMovies(movies) {
	var cache = {}
	return movies.filter(function (movie) {
		if (!cache[movie.url]) {
			cache[movie.url] = true
			return true
		}
		return false
	})
}

exports.parse = getAllMovies