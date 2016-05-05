'use strict'

const Builder = require('./builder')
const Promise = require('bluebird')
const fs = require('fs')
const rmrf = require('rimraf')
const domain = require('domain')

const conf = Builder.config
const buildDomain = domain.create()

buildDomain.on("error", function(err){
  console.error(err.type + " exception")
  console.error("Message:\n" + err.message)
  console.error(err.stack)
})

buildDomain.run(function(){
  if(process.argv[2] && process.argv[2] === "-d" || "--debug"){
    Builder.debugFlag = true
  }

  function checkAndClean(dir){
    let dirStat
    try {
      dirStat = fs.statSync(dir)
    }
    catch (err) {
      dirStat = false
    }
    finally {
      if(dirStat){
        rmrf.sync(dir)
      }
      fs.mkdirSync(dir)
    }
  }
  let jsDir = conf.browserify.in
  let jsLibs = jsDir + '/' + conf.browserify.libdir
  let jsFiles = []

  let jsFilePusher = function(dir){
    fs.readdirSync(dir).forEach(function(filename){
      let jsIdentifier = /.\.js$/g
      if( jsIdentifier.test(filename) ){
        jsFiles.push(dir + '/' + filename)
      }
    })
  }

  jsFilePusher(jsDir)
  jsFilePusher(jsLibs)

  jsFiles.forEach(function(file){
    console.log(`linting ${file}`)
    let lintOut
    try {
      lintOut = Builder.lint(false, file)
      console.log(lintOut.toString())
    } catch (err){
      console.error(err.stdout.toString())
      console.error("\n")
    }
  })

  checkAndClean(conf.stylus.out)
  Builder.compileStylus(false)

  Builder.compilePug()

  checkAndClean(conf.browserify.out)
  Builder.rebuildJavascripts(false)
})
