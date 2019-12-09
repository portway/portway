import { ActionTypes } from '../actions'

const initialState = {
  isSearching: false,
  searchTerm: null,
  searchResultsByDocumentId: null,
}

// Search results
export const search = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ROUTE_CHANGE:
    case ActionTypes.SEARCH_CLEAR: {
      // Reset on route change
      return {
        ...state,
        isSearching: false,
        searchResultsByDocumentId: null,
        searchTerm: null,
      }
    }
    case ActionTypes.INITIATE_DOCUMENT_SEARCH: {
      const searchTerm = action.value
      if (searchTerm.trim() === '') {
        // If the user clears the search value, reset all search things
        return {
          ...state,
          isSearching: false,
          searchResultsByDocumentId: null,
          searchTerm: null,
        }
      }
      return {
        ...state,
        isSearching: true,
        searchTerm,
      }
    }
    case ActionTypes.RECEIVE_DOCUMENT_RESULTS: {
      const searchResultsByDocumentId = action.data.reduce((docsById, doc) => {
        docsById[doc.id] = doc
        return docsById
      }, {})
      return {
        ...state,
        isSearching: false,
        searchResultsByDocumentId,
      }
    }
    default:
      return { ...state }
  }
}
