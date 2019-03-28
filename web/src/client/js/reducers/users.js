import { ActionTypes } from '../actions'

const initialState = {
  usersById: {},
  loading: {
    list: null,
    byId: {}
  }
}

export const users = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_USERS: {
      return { ...state, loading: { ...state.loading, list: true } }
    }
    case ActionTypes.RECEIVE_USERS: {
      const usersById = action.data.reduce((usersById, user) => {
        usersById[user.id] = user
        return usersById
      }, {})
      return { ...state, usersById, loading: { ...state.loading, list: false } }
    }
    case ActionTypes.REQUEST_USER: {
      const loadingById = { ...state.loading.byId, [action.id]: true }
      return {
        ...state,
        loading: { ...state.loading, byId: loadingById }
      }
    }
    case ActionTypes.RECEIVE_USER: {
      const id = action.data.id
      const usersById = { ...state.usersById, [id]: action.data }
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, usersById, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.LOGOUT_USER: {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
      location.href = '/'
      return { ...state }
    }
    default: {
      return state
    }
  }
}
