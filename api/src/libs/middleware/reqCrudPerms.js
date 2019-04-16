// Uses reqPermissionsMiddleware to build a reusable set of CRUD middlewares
// for a given resource
import actions from '../../constants/actions'
import perms from './reqPermissionsMiddleware'

export default (resourceType, dataFunc) => {
  if (typeof resourceType !== 'string') {
    throw new Error('resourceType must be a string')
  }
  if (typeof dataFunc !== 'function') {
    throw new Error('dataFunc must be a function')
  }

  const listPerm = perms((req) => {
    return {
      resourceType,
      action: actions.LIST,
      data: dataFunc(req)
    }
  })

  const readPerm = perms((req) => {
    return {
      resourceType,
      action: actions.READ,
      data: dataFunc(req)
    }
  })

  const createPerm = perms((req) => {
    return {
      resourceType,
      action: actions.CREATE,
      data: dataFunc(req)
    }
  })

  const updatePerm = perms((req) => {
    return {
      resourceType,
      action: actions.UPDATE,
      data: dataFunc(req)
    }
  })

  const deletePerm = perms((req) => {
    return {
      resourceType,
      action: actions.DELETE,
      data: dataFunc(req)
    }
  })

  return {
    listPerm,
    readPerm,
    updatePerm,
    deletePerm,
    createPerm
  }
}
