import { ActionTypes } from '../actions'

const initialState = {}

export const project = (state = initialState, action) => {
  switch (action.type) {
    // Project
    case ActionTypes.REQUEST_PROJECT:
      console.info('Requesting project', action.id)
      return state
      break
    case ActionTypes.RECEIVE_PROJECT:
      return action.data
    default:
      return state
  }
}
