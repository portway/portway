import { Users, UserProjectAssignments, Validation } from './index'
import { fetch, update, validationCodes } from '../api'

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

export const updateUser = (userId, body) => {
  return async (dispatch) => {
    dispatch(Users.initiateUpdate(userId))
    const { data, status } = await update(`users/${userId}`, body)
    console.log(data, status)
    validationCodes.includes(status) ?
      dispatch(Validation.create('user', data, status)) :
      dispatch(Users.receiveOneUpdated(data))
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
