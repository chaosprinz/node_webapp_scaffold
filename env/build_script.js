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
  console.log(jsFiles)
  jsFiles.forEach(function(file){
    Builder.lint(false, file).then(function(data){
      console.log(`linting ${file}`)
      console.log(data.join("\n"))
    }).catch(function(err){
      console.error(err)
    })
  })
  /***
  console.log(jsFiles[3])
  Builder.lint(false, jsFiles[0]).then(function(data){
    console.log(data)
  })
  */

  //checkAndClean(conf.stylus.out)
  //Builder.compileStylus(false)

  //Builder.compilePug()

  //checkAndClean(conf.browserify.out)
  //Builder.rebuildJavascripts().then((err) => {console.log("Built browser-js")})
})
