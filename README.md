# Webapp-Scaffold

My basic scaffold for a web-application using mostly used tools in the nodejs-world.

## server-side-tools used
- [express](http://expressjs.com/) for http-routing
- [socket.io](https://github.com/socketio/socket.io) for realtime-messaging
- [pug](http://www.pug-lang.com/) formaly known as [Jade](http://jade-lang.com/) as template-engine server and client-side

## client-building-tools used
- [zepto.js](http://zeptojs.com/) as client-side scripting-helper
- [browserify](http://browserify.org/) for commonjs-style moduling on the client
- [stylus](stylus-lang.com) as css-preprocessor
- [rupture](http://jenius.github.io/rupture/#measure) stylus-plugin for media-queries
- [jeet](http://jeet.gs/) stylus-plugin for grid-layouts

## development-helper-tools used
- [mocha](https://mochajs.org) as bdd-framework
- [chai](http://chaijs.com/) as assertion-library
- [sinon](http://sinonjs.org/) for mocks, stubs and spies
- [sinon-chai](https://github.com/domenic/sinon-chai) for coupling the both, above
- [supertest](https://github.com/visionmedia/supertest) for more integration-like server testing
- [jshint](http://jshint.com/) for linting code

## Building, watching, starting etc.
I dont use grunt, gulp or some other fancy task-runner. Nodejs ships with npm, which does its job pretty well. So i use it with some custom build- and watch-scripts.

## Pure js
I dont use coffee-, typo- or whatever-script which then will be compiled into javascript which will be interpreted by node. I find it a useless abstraction of abstracted abstractions in an abstracted way.

## Configuration through environment
I use following environment-variables to configure the application:
- NODE_ENV : The environment to run the application. Needed for decision of livereload-injection or configuring log-verbosity etc.
- PORT : The Port the application should run
- CONFIGS : Directory which holds some json-files for runtime-configurations like string-injections
