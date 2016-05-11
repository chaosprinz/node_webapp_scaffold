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

  function checkAndClean(file, isDir){
    if(typeof isDir === 'undefined') isDir = true
    let fileStat
    try {
      fileStat = fs.statSync(file)
    }
    catch (err) {
      fileStat = false
    }
    finally {
      if(fileStat){
        rmrf.sync(file)
      }
      if (isDir) {
        fs.mkdirSync(file)
      }
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
    Builder.lint(file).then(function(data){
      console.log(`linting ${file}`)
      console.log(data.join("\n"))
      console.log()
    }).catch(function(err){
      console.error(err)
    })
  })

  checkAndClean(conf.stylus.out, false)
  Builder.compileStylus(false).then((data) => {
    console.log("Compiled stylus to " + conf.stylus.out)
  })

  Builder.compilePug().then(() => {
    console.log("Built template-functions")
  })

  checkAndClean(conf.browserify.out)
  Builder.rebuildJavascripts().then((err) => {console.log("Built browser-js")})
})
