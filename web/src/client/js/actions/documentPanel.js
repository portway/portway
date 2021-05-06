import { DocumentPanel } from './index'

export const toggleDocumentPanel = (value) => {
  return async (dispatch) => {
    dispatch(DocumentPanel.togglePanel(value))
  }
}

export const selectDocumentPanelTab = (tabIndex) => {
  return async (dispatch) => {
    dispatch(DocumentPanel.selectTab(tabIndex))
  }
}

export const selectDocumentField = (fieldId) => {
  return async (dispatch) => {
    dispatch(DocumentPanel.selectField(fieldId))
  }
}
