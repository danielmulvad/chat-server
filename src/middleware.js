class Middleware {
  index (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type')
    res.header('Content-Type', 'application/json')
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }
    next()
  }
}

module.exports = Middleware
