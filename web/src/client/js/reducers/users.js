import { ActionTypes } from '../actions'

const initialState = {
  usersById: {},
  loading: {
    list: null
  }
}

export const users = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_USERS:
      return { ...state, loading: { ...state.loading, list: true } }
    case ActionTypes.RECEIVE_USERS:
      const usersById = action.data.reduce((usersById, user) => {
        usersById[user.id] = user
        return usersById
      }, {})
      return { ...state, usersById, loading: { ...state.loading, list: false } }
    default:
      return state
  }
}
