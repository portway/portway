import { ActionTypes } from '../actions'

const initialState = {}

export const projects = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECTS:
      console.info('Requesting projects')
      return state
      break
    case ActionTypes.RECEIVE_PROJECTS:
      return action.data.reduce((projectsById, project) => {
        projectsById[project.id] = project
        return projectsById
      }, {})
      break
    default:
      return state
  }
}

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
