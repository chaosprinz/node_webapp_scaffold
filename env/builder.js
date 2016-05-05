'use strict'

const child_process = require('child_process')
const config = require('./build.conf')
const buildPugTemplates = require('./client_pug')

const Builder = {
  config: config,
  debugFlag: false,
  compilePug:  function(){
    buildPugTemplates(Builder.config.pug.in, Builder.config.pug.out)
  },

  compileStylus: function(action, path){
    let cmd = "node node_modules\\stylus\\bin\\stylus"
    cmd += ` ${Builder.config.stylus.in}\\${Builder.config.stylus.main}`
    Builder.config.stylus.libs.forEach(function(lib){
      cmd += ` -u ${lib}`
    })
    cmd += ` --out ${Builder.config.stylus.out}`
    if(this.debugFlag) cmd += ' --sourcemap'

    let callback = function(err, stdout, stderr){
      if(err) {
        console.error("StylusWatcher error:")
        console.error(err)
      }
      if(stderr) {
        console.error("Stylus compile-error:")
        console.error(stderr)
      }
      console.log("Stylus compiler-output")
      console.log(stdout)
    }
    if(action){
      console.log(`Stylus: ${action} on ${path}`)
      child_process.exec(cmd, callback)
    } else {
      child_process.execSync(cmd)
    }

  },

  rebuildJavascripts: function(action,path){
    let cmd = `node node_modules\\browserify\\bin\\cmd `
    cmd += `${Builder.config.browserify.in}\\main.js -o `
    cmd += `${Builder.config.browserify.out}\\main.js`
    if(this.debugFlag) cmd += ' --debug'

    let callback = function(err, stdout, stderr){
      if(err){
        console.error("BrowserifyWatcher error:")
        console.error(err)
      }
      if(stderr){
        console.error("Browserify compile-error:")
        console.error(stderr)
      }
      console.log("Rebuilt client-javascript")
    }

    if(action){
      console.log(`Browserify: ${action} on ${path}`)
      child_process.exec(cmd, callback)
    } else {
      child_process.execSync(cmd)
    }
  },
  lint: function(action, script){
    let cmd = "node node_modules\\jshint\\bin\\jshint "
    cmd  += script

    let callback = function(err, stdout, stderr){
      if(stderr){
        console.log("JSHint-output")
        console.error(stderr)
      }
      if(stdout){
        console.log("JSHint-output")
        console.log(stdout)
      }
    }

    if(action){
      console.log(`\n\nJSHinting ${script}`)
      child_process.exec(cmd, callback)
    } else {
      return child_process.execSync(cmd)
    }
  }

}

module.exports = Builder
