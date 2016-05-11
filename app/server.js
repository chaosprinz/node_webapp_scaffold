/* exported io */
'use strict'

//setup libraries
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

function runServer() {

  //check and set Environment
  if(!process.env.PORT) process.env.PORT = 3000
  if(!process.env.APPDIR) process.env.APPDIR = process.cwd() + "/app"
  if(!process.env.CONFIGS) process.env.CONFIGS = process.env.APPDIR + "/conf"

  //configure express-app
  app.set('view engine', 'pug')
  app.set('views', process.cwd() + "/app/views")
  app.use(bodyParser.json()) // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
  app.use(express.static('public'))

  //setup express-routes
  const baseRoutes = require('./routes/index')
  app.get('/', baseRoutes.home)

  //start the server
  const server = http.listen(process.env.PORT,function(){
    console.log("listening on *:" + process.env.PORT)
  })
  return server
}
module.exports = runServer
