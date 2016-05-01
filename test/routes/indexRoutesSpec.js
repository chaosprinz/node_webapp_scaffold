'use strict'

const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.should()
chai.use(sinonChai)

process.env.APPDIR = process.cwd() + "/app"
process.env.CONFIGS = process.cwd() + "/test/routes/fixtures/conf"


describe('home',function(){

  const routeStringsConfig = require("./fixtures/conf/strings")

  let routeFile = process.env.APPDIR + "/routes/index"
  let indexRoutes = require(routeFile)

  let reloadRouteFile = function(){
    delete require.cache[require.resolve(routeFile)]
    indexRoutes = require(routeFile)
  }

  let req = {}; let res = {}
  let passedToPug

  beforeEach(function(){
    process.env.NODE_ENV = "development"
    res.render = sinon.spy()
    passedToPug = {
      title: routeStringsConfig.app.name,
      description: routeStringsConfig.app.description,
      livereload: true
    }
    reloadRouteFile()
  })

  it('should inject livereload-script based on NODE_ENV', function(){
    indexRoutes.home(req, res)
    res.render.should.have.been.calledWith('index', passedToPug)

    process.env.NODE_ENV = "production"
    reloadRouteFile()
    passedToPug.livereload = false
    indexRoutes.home(req, res)
    res.render.should.have.been.calledWith('index', passedToPug)
  })

  it('should respond with set title and description', function(){
    indexRoutes.home(req, res)
    res.render.should.have.been.calledWith('index',passedToPug)
  })
})
