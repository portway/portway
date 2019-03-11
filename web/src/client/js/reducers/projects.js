import { ActionTypes } from '../actions'

const initialState = {
  projectsById: {},
  loading: {
    list: null,
    byId: {}
  }
}

export const projects = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECTS:
      console.info('Requesting projects')
      return { ...state, loading: { ...state.loading, list: true } }
      break
    case ActionTypes.RECEIVE_PROJECTS:
      const projectsById = action.data.reduce((projectsById, project) => {
        projectsById[project.id] = project
        return projectsById
      }, {})
      return { ...state, projectsById, loading: { ...state.loading, list: false } }
      break
    default:
      return state
  }
}
