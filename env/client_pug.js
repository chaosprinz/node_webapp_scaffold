'use strict'
const fs = require('fs')
const jade = require('pug')
const domain = require('domain')

/*
* This script takes 2 arguments, first is path to templates dir,
* and second is path to folder where to put compiled templates.js
*
* It scans templates dir, takes all .pug files and compiles them
* as Pug templates. Then it writes all template functions to
* single output file templates.js
*/

const buildPugTemplates = function(input, output){
  const files = fs.readdirSync(input)
  function isPugTemplate(file) {
    let extension = file.split('.').pop()
    if (extension == "pug" ) {
      return true
    }
    return false
  }

  function getFilename(file) {
    return file.split(".")[0]
  }
  /*
  * Main
  */
  let functions = {}
  let buffer = "var jade = require('./lib/runtime.js');\nvar pugView={};\n"

  for (let f in files) {
    let file = files[f]
    if (!isPugTemplate(file)) continue

    contents = fs.readFileSync(input + "/" + file)
    options = {
      compileDebug:false,
      filename: input + file
    }
    compiledFunction = pug.compileClient(contents, options)
    buffer += "pugView['" + getFilename(file) + "'] = " + compiledFunction + "\n"
  }
  buffer += "module.exports = pugView;"
  fs.writeFileSync(output, buffer)
}

module.exports = buildPugTemplates
