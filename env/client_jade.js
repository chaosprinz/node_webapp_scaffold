/*
 * This script takes 2 arguments, first is path to templates dir,
 * and second is path to folder where to put compiled templates.js
 *
 * It scans templates dir, takes all .pug files and compiles them
 * as Pug templates. Then it writes all template functions to
 * single output file templates.js
 */

var fs = require('fs');
var jade = require('pug');

var templatesDir = process.argv[2];
var files = fs.readdirSync(templatesDir);

function isPugTemplate(file) {
    var extension = file.split('.').pop();
    if (extension == "pug" ) {
        return true;
    }
    return false;
}

function getFilename(file) {
    return file.split(".")[0];
}

/*
 * Main
 */
var functions = {};
var buffer = "var jade = require('./lib/runtime.js');\nvar pugView={};\n";

for (var f in files) {
    var file = files[f];
    if (!isPugTemplate(file)) continue;

    contents = fs.readFileSync(templatesDir + "/" + file);
    options = {
        compileDebug:false,
        filename: templatesDir + file
    }
    compiledFunction = pug.compileClient(contents, options);
    buffer += "pugView['" + getFilename(file) + "'] = " + compiledFunction + "\n";
}
buffer += "module.exports = pugView;"
outputFile = process.argv[3];
fs.writeFileSync(outputFile, buffer);
