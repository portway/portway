import { ActionTypes } from '../actions'

const initialState = {
  '1': {
    name: 'BonkeyBong.com',
    users: []
  },
  '2': {
    name: 'Gates Performance Overview Tool',
    users: []
  }
}

export const projects = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LIST_PROJECTS:
      break
    case ActionTypes.CREATE_PROJECT:
      break
    case ActionTypes.EDIT_PROJECT:
      break
    case ActionTypes.DELETE_PROJECT:
      break
    default:
      return state
  }
}
