const fs = require('fs')
var privateKey = fs.readFileSync('privkey.pem')
const jwt = require('jsonwebtoken')

class Middleware {
  async authenticate (req, res, next) {
    var token = req.headers['x-access-token'] || req.headers['authorization']
    token = token.split(' ')[1]
    if (!token) return res.status(401)
    try {
      const decoded = await jwt.verify(token, privateKey)
      req.user = decoded
      next()
    } catch (err) {
      console.log('ERROR', err)
      res.status(400)
    }
  }
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
