const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const https = require('https')
const mongoose = require('mongoose')
const Users = require('./user')
const Middleware = require('./middleware')
const WebSocket = require('ws')

// middleware
const middleware = new Middleware()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(function (req, res, next) {
  middleware.index(req, res, next)
})

// Setup
const user = new Users()
const server = https.createServer({
  cert: fs.readFileSync('fullchain.pem'),
  key: fs.readFileSync('privkey.pem')
}, app)

// Mongo
mongoose.connect('mongodb://dhm.wtf:27017/users', {
  useNewUrlParser: true
})

let db = mongoose.connection

db.once('open', () => console.log('connected to the database'))
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const wss = new WebSocket.Server({
  server
})

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

app.post('/api/login', (req, res) => {
  user.login(req, res, (result) => res.json(result))
})

app.post('/api/token', middleware.authenticate, async (req, res) => {
  user.authenticate(req, res, () => res.sendStatus(200))
})

app.get('/api/user', middleware.authenticate, (req, res) => {
  user.getAllUsers(req, res, (result) => res.json(result))
})

app.post('/api/user/create', (req, res) => {
  user.register(req, res, (result) => res.json(result))
})

app.get('/api/user/:user', middleware.authenticate, (req, res) => {
  user.getUser(req, res, (result) => res.json(result))
})

server.listen(51819, () => console.log('LISTENING ON PORT 51819'))
