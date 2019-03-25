// Uses reqPermissionsMiddleware to build a reusable set of CRUD middlewares
// for a given resource
import actions from '../../constants/actions'
import perms from './reqPermissionsMiddleware'

export default (resourceType, idFunc) => {
  if (typeof resourceType !== 'string') {
    throw new Error('resourceType must be a string')
  }
  if (typeof idFunc !== 'function') {
    throw new Error('idFunc must be a function')
  }

  const listPerm = perms((req) => {
    return {
      resourceType,
      action: actions.LIST
    }
  })

  const readPerm = perms((req) => {
    return {
      resourceType,
      action: actions.READ,
      data: {
        id: idFunc(req)
      }
    }
  })

  const createPerm = perms((req) => {
    return {
      resourceType,
      action: actions.CREATE
    }
  })

  const updatePerm = perms((req) => {
    return {
      resourceType,
      action: actions.UPDATE,
      data: {
        id: idFunc(req)
      }
    }
  })

  const deletePerm = perms((req) => {
    return {
      resourceType,
      action: actions.DELETE,
      data: {
        id: idFunc(req)
      }
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
