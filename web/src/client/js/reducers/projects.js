import { ActionTypes } from '../actions'
import { QUERY_PARAMS } from 'Shared/constants'

const initialState = {
  sortBy: 'createdAt',
  sortMethod: QUERY_PARAMS.DESCENDING,
  projectsById: {},
  projectIdsByPage: { 1: [] },
  totalPages: null,
  loading: {
    byPage: {},
    byId: {},
    exportById: {}
  },
  exportUrlsById: {}
}

export const projects = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECTS: {
      const loadingByPage = { ...state.loading.byPage, [action.page]: true }
      return { ...state, loading: { ...state.loading, byPage: loadingByPage } }
    }
    case ActionTypes.RECEIVE_PROJECTS: {
      const projectsById = action.data.reduce((projectsById, project) => {
        projectsById[project.id] = project
        return projectsById
      }, {})

      const projectIds = action.data.map(project => project.id)
      const loadingByPage = { ...state.loading.byPage, [action.page]: false }

      const loadingById = action.data.reduce((loadingById, project) => {
        loadingById[project.id] = false
        return loadingById
      }, {})

      return {
        ...state,
        projectsById: { ...state.projectsById, ...projectsById },
        loading: {
          ...state.loading,
          byPage: loadingByPage,
          byId: { ...state.loading.byId, ...loadingById }
        },
        projectIdsByPage: { ...state.projectIdsByPage, [action.page]: projectIds },
        totalPages: action.totalPages
      }
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
    case ActionTypes.RECEIVE_PROJECT_ERROR: {
      const id = action.projectId
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.RECEIVE_CREATED_PROJECT: {
      const id = action.data.id
      const projectsById = { ...state.projectsById, [id]: action.data }
      const projectIdsByPage = { ...state.projectIdsByPage, 1: [id, ...state.projectIdsByPage[1]] }
      return { ...state, projectsById, projectIdsByPage, loading: { ...state.loading, byId: { ...state.loading.byId, [id]: false } } }
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
    case ActionTypes.REMOVE_PROJECT: {
      const id = action.id
      // eslint-disable-next-line no-unused-vars
      const { [id]: __, ...projectsById } = state.projectsById

      const projectIdsByPage = Object.keys(state.projectIdsByPage).reduce((cur, pageNum) => {
        const validIds = state.projectIdsByPage[pageNum].filter(pageProjectId => pageProjectId !== id)
        cur[pageNum] = validIds
        return cur
      }, {})

      return { ...state, projectsById, projectIdsByPage }
    }
    case ActionTypes.SORT_PROJECTS: {
      if (action.sortBy !== state.sortBy || action.sortMethod !== state.sortMethod) {
        return {
          ...state,
          projectIdsByPage: {},
          totalPages: null,
          sortBy: action.sortBy,
          sortMethod: action.sortMethod,
          loading: { ...state.loading, byPage: {} }
        }
      }
      return state
    }
    case ActionTypes.INITIATE_PROJECT_EXPORT: {
      return {
        ...state,
       loading: { ...state.loading, exportById: { [action.projectId]: true } }
      }
    }
    case ActionTypes.COMPLETE_PROJECT_EXPORT: {
      return {
        ...state,
        loading: { ...state.loading, exportById: { [action.projectId]: false } },
        exportUrlsById: { ...state.exportUrlsById, [action.projectId]: action.data.url }
      }
    }
    case ActionTypes.CLEAR_PROJECT_EXPORT_URL: {
      return {
        ...state,
        exportUrlsById: { ...state.exportUrlsById, [action.projectId]: null }
      }
    }
    default:
      return state
  }
}
