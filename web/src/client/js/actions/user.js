import { Notifications, Users, UserProjectAssignments, Validation } from './index'
import { formSubmitAction, formSucceededAction, formFailedAction } from './form'
import { add, fetch, update, remove, globalErrorCodes, validationCodes } from '../api'

import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES, ORGANIZATION_ROLE_IDS } from 'Shared/constants'

const USERS_PER_PAGE = 10
const USERS_PER_SEARCH = 10
/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchUsers = (page = 1, sortBy = 'createdAt', sortMethod = 'DESC') => {
  return async (dispatch) => {
    dispatch(Users.request(page))
    const { data, totalPages, status } = await fetch(
      `users?page=${page}&perPage=${USERS_PER_PAGE}&sortBy=${sortBy}&sortMethod=${sortMethod}`
    )
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    return dispatch(Users.receive(data, page, totalPages))
  }
}

export const fetchUser = (id) => {
  return async (dispatch) => {
    dispatch(Users.requestOne(id))
    const { data, status } = await fetch(`users/${id}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    return dispatch(Users.receiveOne(data))
  }
}

export const createUser = (values) => {
  // If we're creating an admin user we have to post a regular user first
  // and then hit the PUT endpoint to make that user an admin
  const body = {
    name: values.name,
    email: values.email
  }
  let role = ORGANIZATION_ROLE_IDS.USER
  if (values.orgRole === ORGANIZATION_ROLE_IDS.ADMIN) {
    role = ORGANIZATION_ROLE_IDS.ADMIN
  }
  return async (dispatch) => {
    dispatch(Users.create())
    const { data, status } = await add('users', body)
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('user', data, status))
      return
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    dispatch(Users.receiveOneCreated(data))
    // If we're trying to be an admin
    dispatch(updateUserRole(data.id, role))
  }
}

export const updateUser = (formId, userId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Users.initiateUpdate(userId))
    const { data, status } = await update(`users/${userId}`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('user', data, status))
    } else {
      dispatch(formSucceededAction(formId))
      dispatch(Users.receiveOneUpdated(data))
    }
  }
}

export const updateUserAvatar = (formId, userId, formData) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Users.initiateUpdate(userId))
    const { data, status } = await update(`users/${userId}/avatar`, formData)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('user', data, status))
    } else {
      dispatch(formSucceededAction(formId))
      dispatch(Users.receiveUpdatedAvatar(userId, data))
    }
  }
}

export const updatePassword = (formId, userId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Users.initiateUpdate(userId))
    const { data, status } = await update(`users/${userId}/password`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('user', data, status))
    } else {
      dispatch(Notifications.create('Password change successful 👍🏽', NOTIFICATION_TYPES.SUCCESS, NOTIFICATION_RESOURCE.USER, status))
      dispatch(formSucceededAction(formId))
      dispatch(Users.receiveUpdatedPassword(userId, data))
    }
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
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('user', data, status)) :
      dispatch(Users.receiveUpdatedRole(userId, orgRoleId))
  }
}

export const reinviteUser = (userId) => {
  return async (dispatch) => {
    dispatch(Users.initiateReinvite(userId))
    const { data, status } = await add(`users/${userId}/resendinvite`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    dispatch(Users.receiveSuccessfulReinvite(userId))
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
    const { data, status } = await fetch(`users/${userId}/assignments`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    return dispatch(UserProjectAssignments.receive(userId, data))
  }
}

export const searchByName = (partialNameString) => {
  return async (dispatch) => {
    dispatch(Users.initiateSearchByName(partialNameString))
    const { data } = await fetch(`users?nameSearch=${partialNameString}&page=1&perPage=${USERS_PER_SEARCH}`)
    return dispatch(Users.receiveSearchResultsByName(data, partialNameString))
  }
}

export const sortUsers = (sortBy, sortMethod) => {
  return (dispatch) => {
    return dispatch(Users.sort(sortBy, sortMethod))
  }
}
