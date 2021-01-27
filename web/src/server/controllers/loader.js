import express from 'express'
import constants from '../../shared/constants'
import auth from '../libs/auth'
// To add a controller, add the base path to mount it as a key and the controller
// filename as the value
// Controllers can be added as unauthorized (custom auth or public controllers),
// or a regular authenticated controller

// Controllers that uses default auth
const AUTHENTICATED_CONTROLLERS = {
  [constants.PATH_APP]: 'app'
}

// Define controllers with custom auth (must be implemented in the controller!)
const UNAUTHENTICATED_CONTROLLERS = {
  '/sign-in': 'sign-in',
  '/sign-up': 'sign-up',
  '/password-reset': 'password-reset',
  '/': 'home',
  // needs to be in sync with marketing site form submission url
  '/squishymuffins': 'support',
  '/solidmuffins': 'mailinglist'
}

const loadControllers = (router, controllers, middleware) => {
  Object.keys(controllers).forEach((path) => {
    const controllerFileName = controllers[path]
    const controller = require(`./${controllerFileName}`).default
    const controllerRouter = express.Router()
    controller(controllerRouter)
    if (middleware && middleware.length) {
      router.use(path, ...middleware, controllerRouter)
    } else {
      router.use(path, controllerRouter)
    }
  })
}

const loader = (router) => {
  loadControllers(router, AUTHENTICATED_CONTROLLERS, [auth.jwtMiddleware])
  loadControllers(router, UNAUTHENTICATED_CONTROLLERS, [auth.jwtOptionalUser])
}

export default loader
