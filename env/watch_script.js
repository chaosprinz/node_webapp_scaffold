  'use strict'

/*
# Build-environment filewatcher-script

 */
const chokidar = require('chokidar')
const Builder = require('./builder')

Builder.debugFlag = true

/*
## pugWatcher
Watching for files in the template-source-directory.
These files are going to be rendered in the front-end, so they have to be
precompiled to a function.
Look at env/client_pug.js for details about this process.
 */
const pugWatcher = chokidar.watch(Builder.config.pug.in, { persistent: true })

pugWatcher.on('all', (action, path) => {
  Builder.compilePug()
})

/*
## StylusWatcher
Watching for files in the stylesheets-source-directory and recompile the
index.styl-file on changes.
 */

const stylusWatcher = chokidar.watch(Builder.config.stylus.in,{ persistent: true })


stylusWatcher.on('all', (action, path) => {
  Builder.compileStylus(path).then((data) => {
    console.log(action + ' on ' + path + ":\n")
    console.log("rebuilt css")
    console.log()
  })
})

/*
## BrowserifyWatcher
Watch for changes on client-javascript in their source dir and and let
browserify rebuild them.
 */

const browserifyWatcher = chokidar.watch(Builder.config.browserify.in + "/**/*.js", {
  persistent: true
})


browserifyWatcher.on('all', (action, path) => {
  Builder.rebuildJavascripts().then((data) => {
    console.log(action + ' on ' + path + ":\n")
    console.log("rebuilt pubplic-js")
    console.log()
  })
})

/*
Linting Javascript-files
 */
 const publicjsWatcher = chokidar.watch(Builder.config.browserify.in + "/**/*.js", {
   persistent: true
 })
publicjsWatcher.on('all', (action, path) => {
  console.log(action + ' on ' + path + ":\n")
  Builder.lint(path).then((data) => {
    console.log("Linting " + path)
    console.log(data.join("\n"))
    console.log()
  })
})
const nodejsWatcher = chokidar.watch([
  Builder.config.nodejs.libs + "/**/*.js",
  Builder.config.nodejs.entry,
  Builder.config.nodejs.app + "/routes/**/*.js",
  Builder.config.nodejs.app + "/server.js",
  Builder.config.nodejs.app + "/models/**.js"
], {
  persistent: true
})
nodejsWatcher.on('all', (action, path) => {
  console.log(action + ' on ' + path + ":\n")
  Builder.lint(path).then((data) => {
    console.log("Linting " + path)
    console.log(data.join("\n"))
    console.log()
  })
})
