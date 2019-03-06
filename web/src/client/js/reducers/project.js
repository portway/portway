import { ActionTypes } from '../actions'

const initialState = {}

export const projects = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_PROJECTS:
      return action.data.reduce((projectsById, project) => {
        projectsById[project.id] = project
        return projectsById
      }, {})
      break
    case ActionTypes.LIST_PROJECTS:
    case ActionTypes.CREATE_PROJECT:
    case ActionTypes.EDIT_PROJECT:
    case ActionTypes.DELETE_PROJECT:
    default:
      return state
  }
}
