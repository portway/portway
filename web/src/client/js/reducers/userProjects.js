import { ActionTypes } from '../actions'

const initialState = {
  projectsByUserId: {},
  loading: {
    byUserId: {}
  }
}

export const userProjects = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_USER_PROJECTS: {
      const loadingByUserId = { ...state.loading.byUserId, [action.userId]: true }
      return { ...state, loading: { byUserId: loadingByUserId } }
    }
    case ActionTypes.RECEIVE_USER_PROJECTS: {
      const projectsById = action.data.reduce((projectsById, project) => {
        projectsById[project.id] = project
        return projectsById
      }, {})

      const loadingByUserId = action.data.reduce((loadingByUserId, project) => {
        loadingByUserId[action.userId] = false
        return loadingByUserId
      }, {})

      return {
        ...state,
        projectsByUserId: { ...state.projectsByUserId, [action.userId]: projectsById },
        loading: { ...state.loading, byUserId: { ...state.loading.byUserId, ...loadingByUserId } }
      }
    }
    default:
      return state
  }
}
