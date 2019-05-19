const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const Data = require('./data')

const API_PORT = 51819
const app = express()
const dbRoute = 'mongodb://localhost:27017/users'

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-type')
  res.header('Content-Type', 'application/json')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  next()
})
app.use(bodyParser.json({ limit: '50mb' })) // 50 mb total data cap (including photo)

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
)

let db = mongoose.connection

db.once('open', () => console.log('connected to the database'))
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/api/user', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true, data: data })
  })
})

app.get('/api/user/:user', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true, data: data })
  })
})

app.post('/user/:user/update', (req, res) => {
  const { id, update } = req.body
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true })
  })
})

app.delete('/user/:user/delete', (req, res) => {
  const { id } = req.body
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err)
    return res.json({ success: true })
  })
})

app.post('/api/user/create', (req, res) => {
  let data = new Data()
  console.log(req.body)
  const { username, password } = req.body

  if ((!username && username !== 0) || !password) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    })
  }

  data.username = username
  data.password = password

  data.save(err => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true })
  })
})

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))
