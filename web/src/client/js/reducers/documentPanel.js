import { ActionTypes } from '../actions'

const initialState = {
  panel: {
    visible: false,
    selectedTabIndex: 0,
  }
}

export const documentPanel = (state = initialState, action) => {
  switch (action.type) {
    // Toggle the panel open true/false
    case ActionTypes.DOCUMENT_PANEL_TOGGLE: {
      return {
        ...state,
        panel: { ...state.panel, visible: action.value }
      }
    }

    // Switching tabs in the panel
    case ActionTypes.DOCUMENT_PANEL_TAB_SELECTION: {
      return {
        ...state,
        panel: { ...state.panel, selectedTabIndex: action.value }
      }
    }

    // On route changes, close the panel?
    case ActionTypes.ROUTE_CHANGE: {
      return {
        ...state,
        panel: { ...state.panel, visible: false }
      }
    }

    default: {
      return state
    }
  }
}
