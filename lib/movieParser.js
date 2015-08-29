function getAllMovies(html) {
	var achors = parseAndGetAllAchors(html).map(parseAchor)
	achors = achors.filter(function (achor) {
		return achor && achor.href && achor.title
	})
	var movies = achors.map(function (achor) {
		return {
			name: achor.title,
			url: achor.href
		}
	})
	return dedupMovies(movies)
}

/*
 * 从 html 文本中获取所有<a>的完整内容
 * @param {string} html
 * @returns {string[]}
 */
function parseAndGetAllAchors(html) {
	var ret = []
	html.replace(/\<a.*?<\/a\>/ig, function (match) {
		ret.push(match)
		return ''
	})
	return ret
}

/*
 * 解析<a>对应的html片段
 * @param {string} achor - html fragment of <a>
 * @returns {Object} - href, title, innerHTML
 */
function parseAchor(achor) {
	var startTagEnd = achor.indexOf('>')
	var endTagStart = achor.lastIndexOf('<')
	var o = {}
	var startTag = achor.slice(0, startTagEnd + 1)
	var innerHTML = achor.slice(startTagEnd + 1, endTagStart)
	var href = startTag.match(/href=['"]([^'"]*)['"]/i) // 单引号双引号都有可能
	var title = startTag.match(/title=['"]([^'"]*)['"]/i)
	if (href) o.href = href[1]
	if (title) o.title = title[1]
	if (innerHTML) o.innerHTML = innerHTML
	return o
}

/*
 * 去重重复电影
 */
function dedupMovies(movies) {
	var ret = []
	var cache = []
	movies.forEach(function (movie) {
		if (!cache[movie.url]) {
			cache[movie.url] = true
			ret.push(movie)
		}
	})
	return ret
}

exports.parse = getAllMovies