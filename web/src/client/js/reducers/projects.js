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
    case ActionTypes.REQUEST_PROJECTS: {
      return { ...state, loading: { ...state.loading, list: true } }
    }
    case ActionTypes.RECEIVE_PROJECTS: {
      const projectsById = action.data.reduce((projectsById, project) => {
        projectsById[project.id] = project
        return projectsById
      }, {})
      return { ...state, projectsById, loading: { ...state.loading, list: false } }
    }
    case ActionTypes.REQUEST_PROJECT: {
      const loadingById = { ...state.loading.byId, [action.id]: false }
      return {
        ...state,
        currentProjectId: action.id,
        loading: { ...state.loading, byId: loadingById }
      }
    }
    case ActionTypes.RECEIVE_PROJECT: {
      const id = action.data.id
      const projectsById = { ...state.projectsById, [id]: action.data }
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, projectsById, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.RECEIVE_CREATED_PROJECT: {
      const id = action.data.id
      const projectsById = { ...state.projectsById, [id]: action.data }
      return { ...state, projectsById }
    }
    case ActionTypes.INITIATE_PROJECT_UPDATE: {
      const id = action.id
      const loadingById = { ...state.loading.byId, [id]: true }
      return { ...state, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.RECEIVE_UPDATED_PROJECT: {
      const id = action.data.id
      const projectsById = { ...state.projectsById, [id]: action.data }
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, projectsById, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.INITIATE_PROJECT_REMOVE: {
      return { ...state, loading: { ...state.loading, list: true } }
    }
    case ActionTypes.REMOVE_PROJECT: {
      const id = action.id
      // eslint-disable-next-line no-unused-vars
      const { [id]: __, ...projectsById } = state.projectsById
      return { ...state, projectsById, loading: { ...state.loading, list: false } }
    }
    default:
      return state
  }
}
