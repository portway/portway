import { ActionTypes } from '../actions'

// import { ActionTypes } from '../actions'

const initialState = {
  projects: {
    '1': {
      name: 'BonkeyBong.com',
      users: []
    },
    '2': {
      name: 'Gates Performance Overview Tool',
      users: []
    }
  }
}

export const projectReducer = (state = initialState, action) => {
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
