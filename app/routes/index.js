'use strict'

const strings = require(process.env.CONFIGS + "/strings")
const routes = {}
let injectLivereload = true

if(process.env.NODE_ENV === "production"){
  injectLivereload = false
}

routes.home = function(req,res){
  res.render('index', {
    title: strings.app.name,
    description: strings.app.description,
    livereload: injectLivereload
  })
}

module.exports = routes
