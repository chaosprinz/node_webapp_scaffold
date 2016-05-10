'use strict'

const child_process = require('child_process')
const Promise = require('bluebird')
const browserify = Promise.promisifyAll(require('browserify'))
const Fs = Promise.promisifyAll(require('fs'))
const JSHINT = require("jshint").JSHINT
const stylus = require("stylus")
const config = require('./build.conf')
const buildPugTemplates = require('./client_pug')


const Builder = {
  config: config,
  debugFlag: false,
  compilePug:  function(){
    return Promise.resolve(buildPugTemplates(Builder.config.pug.in, Builder.config.pug.out))
  },

  compileStylus: function(path){
    path = path || Builder.config.stylus.in
    return Fs.readFileAsync(path, "utf-8").then(function(data){
      let css = stylus(data)
      css.renderAsync = Promise.promisify(css.render)
      css.set('filename', path.split("/")[-1])

      Builder.config.stylus.mixin_paths.forEach((mixinPath) => {
        css.include(process.cwd() + "/" + mixinPath)
      })

      Builder.config.stylus.libs.forEach((lib) => {
        lib = require(lib)
        css.use(lib())
      })
      return css.renderAsync()
    }).then(function(data){
      return Fs.writeFileAsync(Builder.config.stylus.out, data)
    })
  },

  rebuildJavascripts: function(path){
    let js = browserify(`${Builder.config.browserify.in}/main.js`)
    js = js.bundle()
    return Fs.writeFileAsync(
      Builder.config.browserify.out + "/main.js",
      js.toString()
    )
  },

  lint: function(script){
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
