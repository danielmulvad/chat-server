const fs = require('fs')
var privateKey = fs.readFileSync('privkey.pem')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const DataSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  }
}, {
  timestamps: true
})

// custom method to generate authToken

DataSchema.methods.generateAuthToken = function (callback) {
  jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: {
      _id: this._id,
      username: this.username
    }
  }, privateKey, function (err, token) {
    if (err) {
      console.log('ERROR', err)
    }
    callback(token)
  })
}

const Data = mongoose.model('Data', DataSchema)

module.exports = Data
