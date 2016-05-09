'use strict'

const child_process = require('child_process')
const Promise = require('bluebird')
const browserify = Promise.promisifyAll(require('browserify'))
const Fs = Promise.promisifyAll(require('fs'))
const JSHINT = require("jshint").JSHINT
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
    let js = browserify(`${Builder.config.browserify.in}/main.js`)
    js = js.bundle()
    return Fs.writeFileAsync(
      Builder.config.browserify.out + "/main.js",
      js.toString()
    )
  },

  lint: function(action, script){
    let exit = false
    Builder.config.browserify.lint_ignore.forEach(function(file){
      file = new RegExp(file)
      if (file.test(script)) {
        exit = true
      }
    })
    if(exit)
      return Promise.resolve([`${script} not linted, cause of build.conf`])

    return Fs.readFileAsync(script, "utf-8")
      .then(function(data){
        JSHINT(data, {undef: true}, {})
        let hintErrors = JSHINT.errors.map((hintError) => {
          let msg = `L${hintError.line}-C${hintError.character}: `
          msg += `${hintError.evidence}\nError: ${hintError.reason}`
          return msg
        })
        return Promise.resolve(hintErrors)
      })
  }
}

module.exports = Builder
