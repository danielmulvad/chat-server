const Data = require('./data')
const userData = new Data()
const bcrypt = require('bcrypt')

class User {
  async authenticate (req, res, callback) {
    await Data.find({ username: req.params.user }, '-password', (err, data) => {
      if (err) {
        console.log('ERROR!', err)
      }
      if (data[0] && data[0]._id.toString() === req.body._id) {
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
        userData.generateAuthToken((token) => {
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

  async modifyUser (req, res, callback) {
    const user = await Data.findOne({ username: req.body.username })
    user.avatar = req.body.avatar
    await user.save()
    callback()
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
      userData.firstname = req.body.firstname
      userData.lastname = req.body.lastname
      userData.username = req.body.username
      userData.password = hash
      await userData.save()
      const token = userData.generateAuthToken()
      res.header('authorization', token).send({
        _id: userData._id
      })
    })
  }
}

module.exports = User
