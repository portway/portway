import express from 'express'
import auth from '../libs/auth'
import reqInfoExtractor from '../libs/middleware/reqInfoExtractorMiddleware'

// To add a controller, add the base path to mount it as a key
// and an object with the controller filename as the value,
// additionally, childRoutes can be defined in the same way,
// nested under the childRoutes key
// Controllers can be added as unauthorized (custom auth or public controllers),
/// or a regular authenticated controller

// Controllers that uses default auth
const AUTHENTICATED_CONTROLLERS = {
  '/billing': { fileName: 'billing' },
  '/projects': {
    fileName: 'projects',
    childRoutes: {
      '/:projectId/assignments': { fileName: 'projectUsers' },
      '/:projectId/documents': { fileName: 'projectDocuments' },
      '/:projectId/tokens': { fileName: 'projectTokens' }
    }
  },
  '/documents': {
    fileName: 'documents',
    childRoutes: { '/:documentId/fields': { fileName: 'documentFields' } }
  },
  '/users': {
    fileName: 'users',
    childRoutes: {
      '/:userId/orgrole': { fileName: 'userOrgrole' }
    }
  }
}

// Define controllers with custom auth (must be implemented in the controller!)
const UNAUTHENTICATED_CONTROLLERS = {
  '/login': { fileName: 'login' },
  '/signup': { fileName: 'signup' }
}

const loadControllers = (router, controllers, middleware, routerOptions) => {
  Object.keys(controllers).forEach((path) => {
    const controllerFileName = controllers[path].fileName
    const childRoutes = controllers[path].childRoutes
    const controller = require(`./${controllerFileName}`).default
    const controllerRouter = express.Router(routerOptions)
    controller(controllerRouter)
    if (middleware && middleware.length) {
      router.use(path, ...middleware, controllerRouter)
    } else {
      router.use(path, controllerRouter)
    }
    if (childRoutes) {
      loadControllers(controllerRouter, childRoutes, middleware, { mergeParams: true })
    }
  })
}

const loader = (router) => {
  loadControllers(router, AUTHENTICATED_CONTROLLERS, [auth.jwtMiddleware, reqInfoExtractor])
  loadControllers(router, UNAUTHENTICATED_CONTROLLERS)
}

export default loader
