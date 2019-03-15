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
      return { ...state, loading: { ...state.loading, list: true } }
    case ActionTypes.RECEIVE_PROJECTS:
      const projectsById = action.data.reduce((projectsById, project) => {
        projectsById[project.id] = project
        return projectsById
      }, {})
      return { ...state, projectsById, loading: { ...state.loading, list: false } }
    default:
      return state
  }
}
