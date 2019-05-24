const Data = require('./data')
const bcrypt = require('bcrypt')

class User {
  async getAllUsers (req, res, callback) {
    var result
    var response
    await Data.find((err, data) => {
      if (err) {
        console.log('ERROR!', err)
      }
      result = data
      response = { success: true, data: result }
    })
    callback(response)
  }

  async login (req, res, callback) {
    var user
    var response
    await Data.find({
      username: req.body.username
    }, function (err, result) {
      if (err) {
        console.log('ERROR!', err)
      }
      user = result
    })
    if (user[0]) {
      var passEqual = await bcrypt.compare(req.body.password, user[0].password)
      if (passEqual) {
        response = { authenticated: true, data: { username: req.body.username, id: user[0]._id, password: user[0].password } }
        callback(response)
      }
    }
  }

  getUser (req, res, callback) {
    Data.find({ username: req.params.user }, (err, data) => {
      var response
      if (err) {
        response = { success: false, error: err }
        return callback(response)
      }
      response = { success: true, data: data }
      return callback(response)
    })
  }

  async register (req, res, callback) {
    let data = new Data()
    var response
    const { username, password } = req.body
    if ((!username && username !== 0) || !password) {
      response = { success: false, error: 'INVALID INPUTS' }
      return callback(response)
    }
    var temp
    await Data.find({
      username: req.body.username
    }, function (err, result) {
      if (err) {
        console.log('ERROR!', err)
      }
      if (result.length > 0) {
        temp = false
      } else {
        temp = true
      }
    })
    if (temp === false) {
      res.sendStatus(403)
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          console.log('ERROR!', err)
        }
        data.username = username
        data.password = hash
        data.save(err => {
          if (err) {
            response = { success: false, error: err }
            return callback(response)
          }
          response = { success: true }
          return callback(response)
        })
      })
    }
  }
}

module.exports = User
