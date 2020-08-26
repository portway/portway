import express from 'express'
import auth from '../libs/auth/auth'
import reqInfoExtractor from '../libs/middleware/reqInfoExtractorMiddleware'
import checkActiveOrgStatus from '../libs/middleware/checkActiveOrgStatus'
import orgRateLimiter from '../libs/middleware/orgRateLimiter'
import bodyParser from 'body-parser'

// To add a controller, add the base path to mount it as a key
// and an object with the controller filename as the value,
// additionally, childRoutes can be defined in the same way,
// nested under the childRoutes key
// Controllers can be added as unauthorized (custom auth or public controllers),
/// or a regular authenticated controller

const V1_CONTROLLERS = {
  // Controllers that use default auth
  AUTHENTICATED: {
    '/projects': {
      fileName: 'projects',
      childRoutes: {
        '/:projectId/assignments': { fileName: 'projectUsers' },
        '/:projectId/documents': { fileName: 'projectDocuments' },
        '/:projectId/tokens': { fileName: 'projectTokens' },
        '/:projectId/export': { fileName: 'projectExport'},
        '/:projectId/webhooks': { fileName: 'projectWebhooks' }
      }
    },
    '/documents': {
      fileName: 'documents',
      childRoutes: {
        '/:documentId/fields': {
          fileName: 'documentFields',
          childRoutes: {
            '/:fieldId/order': { fileName: 'documentFieldOrder' }
          }
        }
      }
    },
    '/users': {
      fileName: 'users',
      childRoutes: {
        '/:userId/orgrole': { fileName: 'userOrgRole' },
        '/:userId/assignments': { fileName: 'userProjectAssignments' },
        '/:userId/projects': { fileName: 'userProjects' },
        '/:userId/password': { fileName: 'userPassword' }
      },
      allowInactiveOrgAccess: true
    },
    '/organizations': {
      fileName: 'organizations',
      childRoutes: {
        '/:orgId/billing': { fileName: 'orgBilling', allowInactiveOrgAccess: true },
        '/:orgId/plan': { fileName: 'orgPlan', allowInactiveOrgAccess: true },
        '/:orgId/seats': { fileName: 'orgSeats' }
      },
      allowInactiveOrgAccess: true
    }
  },
  // Define controllers with custom auth (must be implemented in the controller!)
  UNAUTHENTICATED: {
    '/login': { fileName: 'login', allowInactiveOrgAccess: true },
    '/signup': { fileName: 'signup', allowInactiveOrgAccess: true },
    '/stripehooks': { fileName: 'stripeHooks', allowInactiveOrgAccess: true, customBodyParsingMiddleware: bodyParser.raw({ type: 'application/json' }) }
  }
}

const loadControllers = (router, controllers, middleware = [], routerOptions) => {
  Object.keys(controllers).forEach((path) => {
    const controllerFileName = controllers[path].fileName
    const childRoutes = controllers[path].childRoutes
    const controller = require(`./${controllerFileName}`).default
    const controllerRouter = express.Router(routerOptions)
    controller(controllerRouter)

    const expandedMiddleware = [...middleware]
    // activate body parsing middleware for each route, before other middleware.
    // Default to json parsing, unless otherwise specified
    if (controllers[path].customBodyParsingMiddleware) {
      expandedMiddleware.unshift(controllers[path].customBodyParsingMiddleware)
    } else {
      expandedMiddleware.unshift(bodyParser.json())
    }
    // activate subscription status check middleware for each route, default is to only allow active
    // orgs access unless allowInactiveOrgAccess is set to true
    if (!controllers[path].allowInactiveOrgAccess) {
      expandedMiddleware.push(checkActiveOrgStatus)
    }

    router.use(path, ...expandedMiddleware, controllerRouter)

    if (childRoutes) {
      loadControllers(controllerRouter, childRoutes, middleware, { mergeParams: true })
    }
  })
}

export const v1Loader = (router) => {
  loadControllers(router, V1_CONTROLLERS.AUTHENTICATED, [auth.jwtMiddleware, reqInfoExtractor, orgRateLimiter])
  loadControllers(router, V1_CONTROLLERS.UNAUTHENTICATED)
}
