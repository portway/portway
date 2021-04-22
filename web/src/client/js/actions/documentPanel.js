import { DocumentPanel } from './index'

export const toggleDocumentPanel = (value) => {
  return async (dispatch) => {
    dispatch(DocumentPanel.togglePanel(value))
  }
}
