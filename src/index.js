const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')

const app = express()
const Users = require('./user')
const Middleware = require('./middleware')

const user = new Users()
const WebSocket = require('ws')
const middleware = new Middleware()
const server = https.createServer({
  cert: fs.readFileSync('fullchain.pem'),
  key: fs.readFileSync('privkey.pem')
}, app)
const wss = new WebSocket.Server({ server })

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
    })
  })
})

app.use(function (req, res, next) {
  middleware.index(req, res, next)
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
server.listen(51819, () => console.log('LISTENING ON PORT 51819'))
