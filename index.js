var http = require('http')
var parseUrl = require('url').parse

var server = http.createServer(function (req, res) {
  var query = parseUrl(req.url, true).query

  if (!query.u) return res.end('?u not provided')

  var proxyUrl = parseUrl(query.u)

  var opts = {
    method: query.m || 'GET',
    host: proxyUrl.hostname,
    port: proxyUrl.protocol === 'https:' ? 443 : 80,
    path: proxyUrl.path
  }

  var proxyReq = http.request(opts, function (proxyRes) {
    proxyRes.pipe(res, {
      end: true
    })
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
  })

  req.pipe(proxyReq, {
    end: true
  })
})

var port = process.env.PORT || 8000
server.listen(port, function (error) {
  if (error) return console.log(error)
  console.log('Listening on port ' + port)
})
