const bodyParser = require('body-parser')
const Data = require('./data')
const jwt = require('jsonwebtoken')

class Middleware {
  index (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Authorization', 'Content-type')
    res.header('Content-Type', 'application/json')
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }
    bodyParser.json({ limit: '50mb' })
    next()
  }

  token (req, res, next) {
    try {
      console.log('middleware')
      const token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, '', function (err, payload) {
        if (err) {
          console.log('ERROR!', err)
        }
        console.log(payload)
        if (payload) {
          Data.find({ username: payload.username }).then(
            (doc) => {
              req.user = doc
              next()
            }
          )
        } else {
          next()
        }
      })
    } catch (e) {
      next()
    }
  }
}

module.exports = Middleware
