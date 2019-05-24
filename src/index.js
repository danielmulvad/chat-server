const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Users = require('./user')

const user = new Users()
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

// Broadcast to all.
wss.broadcast = function broadcast (data) {
  wss.clients.forEach(function each (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (data) {
    console.log('recieved', data)
    wss.clients.forEach(function each (client) {
      client.send(data)
      console.log('sent ' + data)
    })
  })
})

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

app.use(bodyParser.json({ limit: '50mb' }))

app.get('/api/user', (req, res) => {
  user.getAllUsers(req, res, (result) => res.json(result))
})

app.get('/api/user/:user', (req, res) => {
  user.getUser(req, res, (result) => res.json(result))
})

app.post('/api/login', (req, res) => {
  user.login(req, res, (result) => res.json(result))
})

app.post('/api/user/create', (req, res) => {
  user.register(req, res, (result) => res.json(result))
})

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true })

let db = mongoose.connection

db.once('open', () => console.log('connected to the database'))
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.listen(51819, () => console.log(`LISTENING ON PORT 51819`))
