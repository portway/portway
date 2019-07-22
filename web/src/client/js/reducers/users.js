import { ActionTypes } from '../actions'

const initialState = {
  sortBy: 'createdAt',
  usersById: {},
  userIdsByPage: {},
  totalPages: null,
  userSearchResultIdsByNameString: {},
  loading: {
    byPage: {},
    byId: {},
    byNameString: {}
  }
}

export const users = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_USERS: {
      const loadingByPage = { ...state.loading.byPage, [action.page]: true }
      return { ...state, loading: { ...state.loading, byPage: loadingByPage } }
    }
    case ActionTypes.RECEIVE_USERS: {
      const usersById = action.data.reduce((usersById, user) => {
        usersById[user.id] = user
        return usersById
      }, {})

      const userIds = action.data.map(user => user.id)
      const loadingByPage = { ...state.loading.byPage, [action.page]: false }
      return {
        ...state,
        usersById: { ...state.usersById, ...usersById },
        loading: { ...state.loading, byPage: loadingByPage },
        userIdsByPage: { ...state.userIdsByPage, [action.page]: userIds },
        totalPages: action.totalPages
      }
    }
    case ActionTypes.REQUEST_USER: {
      const loadingById = { ...state.loading.byId, [action.userId]: true }
      return {
        ...state,
        loading: { ...state.loading, byId: loadingById }
      }
    }
    case ActionTypes.RECEIVE_USER: {
      const id = action.data.id
      const usersById = { ...state.usersById, [id]: action.data }
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, usersById, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.RECEIVE_CREATED_USER: {
      const id = action.data.id
      const byId = { ...state.loading.byId, [id]: false }
      const usersById = { ...state.usersById, [id]: action.data }
      return { ...state, usersById, loading: { ...state.loading, byId } }
    }
    case ActionTypes.INITIATE_USER_UPDATE: {
      const id = action.userId
      const byId = { ...state.loading.byId, [id]: true }
      return { ...state, loading: { ...state.loading, byId: byId, list: true } }
    }
    case ActionTypes.RECEIVE_UPDATED_USER: {
      const id = action.data.id
      const usersById = { ...state.usersById, [id]: action.data }
      const byId = { ...state.loading.byId, [id]: false }
      return { ...state, usersById, loading: { ...state.loading, byId: byId, list: false } }
    }
    case ActionTypes.RECEIVE_UPDATED_USER_ROLE: {
      const { userId, orgRoleId } = action
      const userObj = { ...state.usersById[userId], orgRoleId }
      const byId = { ...state.loading.byId, [userId]: false }
      return {
        ...state,
        usersById: { ...state.usersById, [userId]: userObj },
        loading: { ...state.loading, byId: byId, list: false }
      }
    }
    case ActionTypes.INITIATE_USER_SEARCH_BY_NAME: {
      const loadingByName = { ...state.loading.byNameString, [action.partialNameString]: true }
      return { ...state, loading: { ...state.loading, byPage: loadingByName } }
    }
    case ActionTypes.RECEIVE_USER_SEARCH_RESULTS_BY_NAME: {
      const usersById = action.data.reduce((usersById, user) => {
        usersById[user.id] = user
        return usersById
      }, {})
      const userIds = action.data.map(user => user.id)
      const loadingByNameString = { ...state.loading.byNameString, [action.partialNameString]: false }
      return {
        ...state,
        usersById: { ...state.usersById, ...usersById },
        loading: { ...state.loading, byNameString: loadingByNameString },
        userSearchResultIdsByNameString: { ...state.userSearchResultIdsByNameString, [action.partialNameString]: userIds }
      }
    }
    case ActionTypes.INITIATE_USER_REMOVE: {
      return { ...state, loading: { ...state.loading, list: true } }
    }
    case ActionTypes.REMOVE_USER: {
      const id = action.userId
      // eslint-disable-next-line no-unused-vars
      const { [id]: __, ...usersById } = state.usersById
      return { ...state, usersById, loading: { ...state.loading, list: false } }
    }
    case ActionTypes.SORT_USERS: {
      if (action.sortBy !== state.sortBy || action.sortMethod !== state.sortMethod) {
        return {
          ...state,
          userIdsByPage: {},
          totalPages: null,
          sortBy: action.sortBy,
          sortMethod: action.sortMethod,
          loading: { ...state.loading, byPage: {} }
        }
      }
      return state
    }
    default: {
      return state
    }
  }
}
