var http = require('http')
var fs = require('fs')
var path = require('path')

var WEB_SITE_ROOT = 'http://www.dy2018.com/'
var cacheDirectory = 'tmp'

http.get(WEB_SITE_ROOT, function (res) {
	var cacheFileStream = fs.createWriteStream(path.resolve(cacheDirectory, newCacheFileName()))
	var data = []
	res.on('data', function (chunk) {
		data.push(chunk)
		cacheFileStream.write(chunk)
	})
	res.on('end', function () {
		findAndSaveMovies(Buffer.concat(data))
		cacheFileStream.end()
	})
})

function newCacheFileName() {
	// todo 使用日期工具库优化得到 'yyyy-mm-dd_hh-HH-ss.html' 形式名称
	var now = new Date()
	var year = now.getFullYear()
	var month = now.getMonth() + 1
	var day = now.getDate()
	return '' + year + month + day + '.html'
}

function findAndSaveMovies(buffer) {
	var outFileStream = fs.createWriteStream('movie.html', {encoding: 'binary'})
	outFileStream.write(new Buffer(
		'<!doctype html>' +
		'<html lang="en">' +
		'<head>' +
		'<meta charset="GBK">' +
		'<link href="movie.css" rel="stylesheet">' +
		'<title>Movies</title>' +
		'</head>' +
		'<body>\n' +
		'<ul>\n',
		'binary'
		)
	)
	
	dedupMovies(
		getAllMovies(buffer.toString('binary')) // 按单字节处理，避免编码问题
	).forEach(function (movie) {
		outFileStream.write(new Buffer(
			'<li>' +
				'<a href="' + movie.url + '" target="_blank">' + movie.name + '</a>' +
			'</li>\n',
			'binary'
			)
		)
	})

	outFileStream.end(new Buffer(
		'</ul>' +
		'</body>' +
		'</html>',
		'binary'
		)
	)
}

function getAllMovies(html) {
	var root = WEB_SITE_ROOT.slice(0, -1) // 去除结尾的 '/'
	var achors = parseAndGetAllAchors(html).map(parseAchor)
	achors = achors.filter(function (achor) {
		return achor && achor.href && achor.title
	})
	return achors.map(function (achor) {
		return {
			name: achor.title,
			url: root + achor.href
		}
	})
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