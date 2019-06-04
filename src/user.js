const Data = require('./data')
const data = new Data()
const bcrypt = require('bcrypt')

class User {
  async authenticate (req, res, callback) {
    await Data.find({ username: req.body.username }, '-password', (err, data) => {
      if (err) {
        console.log('ERROR!', err)
      }
      if (data[0] && data[0]._id.toString() === req.body._id) {
        console.log('callback')
        callback()
      }
    })
  }

  async getAllUsers (req, res, callback) {
    var response
    var result
    await Data.find({}, '-password', (err, data) => {
      if (err) {
        console.log('ERROR!', err)
      }
      result = data
      response = {
        success: true,
        data: result
      }
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
    if (user) {
      var passEqual = await bcrypt.compare(req.body.password, user[0].password)
      if (passEqual) {
        data.generateAuthToken((token) => {
          console.log('GEN TOKEN:', token)
          response = {
            data: {
              _id: user[0]._id,
              username: user[0].username,
              token: token
            }
          }
          callback(response)
        })
      }
    }
  }

  getUser (req, res, callback) {
    Data.find({ username: req.params.user }, '-password', (err, data) => {
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
    await Data.find({
      username: req.body.username
    }, function (err, result) {
      if (err) {
        console.log('ERROR!', err)
      }
    })
    await bcrypt.hash(req.body.password, 10, async function (err, hash) {
      if (err) {
        console.log('ERROR!', err)
      }
      data.username = req.body.username
      data.password = hash
      await data.save()
      const token = data.generateAuthToken()
      res.header('authorization', token).send({
        _id: data._id
      })
    })
  }
}

module.exports = User
