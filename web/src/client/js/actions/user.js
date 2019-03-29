import { Users } from './index'
import { fetch } from '../api'

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchUsers = async (dispatch) => {
  dispatch(Users.request())
  const users = await fetch('users')
  return dispatch(Users.receive(users))
}

export const fetchUser = (id) => {
  return async (dispatch) => {
    dispatch(Users.requestOne(id))
    const user = await fetch(`users/${id}`)
    return dispatch(Users.receiveOne(user))
  }
}

export const logoutUser = (id) => {
  return (dispatch) => {
    dispatch(Users.logout(id))
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
    location.href = '/'
  }
}
