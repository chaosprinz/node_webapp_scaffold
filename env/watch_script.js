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

pugWatcher
  .on('all', Builder.compilePug)

/*
## StylusWatcher
Watching for files in the stylesheets-source-directory and recompile the
index.styl-file on changes.
 */

const stylusWatcher = chokidar.watch(Builder.config.stylus.in,{ persistent: true })


stylusWatcher.on('all', Builder.compileStylus)

/*
## BrowserifyWatcher
Watch for changes on client-javascript in their source dir and and let
browserify rebuild them.
 */

const browserifyWatcher = chokidar.watch(Builder.config.browserify.in, {
  persistent: true
})


browserifyWatcher.on('all', Builder.rebuildJavascripts)

/*
Linting Javascript-files
 */
 const publicjsWatcher = chokidar.watch(Builder.config.browserify.in, {
   persistent: true,
   ignored: /template.js/
 })
publicjsWatcher.on('all', Builder.lint)
const nodejsWatcher = chokidar.watch([
  Builder.config.nodejs.libs,
  Builder.config.nodejs.entry,
  Builder.config.nodejs.app + "/routes",
  Builder.config.nodejs.app + "/server.js",
  Builder.config.nodejs.app + "/models"
], {
  persistent: true
})
nodejsWatcher.on('all', Builder.lint)
