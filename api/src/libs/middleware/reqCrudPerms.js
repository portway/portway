// Uses reqPermissionsMiddleware to build a reusable set of CRUD middlewares
// for a given resource
import perms from './reqPermissionsMiddleware'

export default (resourceType, idFunc) => {
  if (typeof resourceType !== 'string') {
    throw new Error('resourceType must be a string')
  }
  if (typeof idFunc !== 'function') {
    throw new Error('idFunc must be a function')
  }

  const listPerm = perms(req => {
    return {
      resourceType,
      action: 'list'
    }
  })

  const readPerm = perms(req => {
    return {
      resourceType,
      action: 'read',
      data: {
        id: idFunc(req)
      }
    }
  })

  const createPerm = perms(req => {
    return {
      resourceType,
      action: 'create'
    }
  })

  const updatePerm = perms(req => {
    return {
      resourceType,
      action: 'write',
      data: {
        id: idFunc(req)
      }
    }
  })

  const deletePerm = perms(req => {
    return {
      resourceType,
      action: 'write',
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
