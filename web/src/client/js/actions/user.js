import { Notifications, Users, UserProjectAssignments, Validation } from './index'
import { add, fetch, update, remove, globalErrorCodes, validationCodes } from '../api'

import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES, ORGANIZATION_ROLE_IDS } from 'Shared/constants'

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchUsers = async (dispatch) => {
  dispatch(Users.request())
  const { data } = await fetch('users')
  return dispatch(Users.receive(data))
}

export const fetchUser = (id) => {
  return async (dispatch) => {
    dispatch(Users.requestOne(id))
    const { data } = await fetch(`users/${id}`)
    return dispatch(Users.receiveOne(data))
  }
}

export const createUser = (values) => {
  // If we're creating an admin user we have to post a regular user first
  // and then hit the PUT endpoint to make that user an admin
  let body = {}
  let role = ORGANIZATION_ROLE_IDS.USER
  if (values.orgRole === ORGANIZATION_ROLE_IDS.ADMIN) {
    role = ORGANIZATION_ROLE_IDS.ADMIN
    body = {
      name: values.name,
      email: values.email
    }
  } else {
    body = values
  }
  return async (dispatch) => {
    dispatch(Users.create())
    const { data, status } = await add('users', body)
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('user', data, status))
      return
    }
    dispatch(Users.receiveOneCreated(data))
    // If we're trying to be an admin
    if (role === ORGANIZATION_ROLE_IDS.ADMIN) {
      dispatch(updateUserRole(data.id, values.orgRole))
    }
  }
}

export const updateUser = (userId, body) => {
  return async (dispatch) => {
    dispatch(Users.initiateUpdate(userId))
    const { data, status } = await update(`users/${userId}`, body)
    validationCodes.includes(status) ?
      dispatch(Validation.create('user', data, status)) :
      dispatch(Users.receiveOneUpdated(data))
  }
}

export const removeUser = (userId) => {
  return async (dispatch) => {
    dispatch(Users.initiateRemove(userId))
    const { data, status } = await remove(`users/${userId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    dispatch(Users.removeOne(userId))
  }
}

export const updateUserRole = (userId, orgRoleId) => {
  return async (dispatch) => {
    dispatch(Users.initiateUpdate(userId))
    const { data, status } = await update(`users/${userId}/orgRole`, { orgRoleId: orgRoleId })
    validationCodes.includes(status) ?
      dispatch(Validation.create('user', data, status)) :
      dispatch(Users.receiveUpdatedRole(userId, orgRoleId))
  }
}

export const logoutUser = (id) => {
  return (dispatch) => {
    dispatch(Users.logout(id))
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
    location.href = '/'
  }
}

export const fetchUserProjectAssignments = (userId) => {
  return async (dispatch) => {
    dispatch(UserProjectAssignments.request(userId))
    const { data } = await fetch(`users/${userId}/assignments`)
    return dispatch(UserProjectAssignments.receive(userId, data))
  }
}
