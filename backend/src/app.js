const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware')
const services = require('./services')
const graphqlService = require('./services/graphql/graphql.service')
const dependencyGraph = require('./dependencyGraph')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const { migrateDb }= require('./umzug')

async function getApp() {
  const app = express(feathers())
  app.configureAsync = async function configureAsync(fn) {
    await fn.call(this, this)

    return this
  }
  // Load app configuration
  app.configure(configuration())
  // Enable security, CORS, compression, favicon and body parsing
  app.use(helmet())
  app.use(cors())
  app.use(compress())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
  // Host the public folder
  app.use('/', express.static(app.get('public')))

  // Set up Plugins and providers
  app.configure(express.rest())
  app.configure(socketio())

  // Configure other middleware (see `middleware/index.js`)
  app.configure(middleware)
  // Set up our services (see `services/index.js`)
  app.configure(services)
  // The graphql service needs to be configured last to
  // see all the other services
  await app.configureAsync(graphqlService)
  // Set up event channels (see channels.js)
  app.configure(channels)

  // Configure a middleware for 404s and the error handler
  app.use(express.notFound())
  app.use(express.errorHandler({ logger }))

  app.hooks(appHooks)

  await app.configureAsync(migrateDb)
  await app.configureAsync(dependencyGraph.init)

  return app
}

module.exports = getApp
