import { ActionTypes } from '../actions'

const initialState = {
  activeDocumentUsers: {},
  currentDocumentRoom: null,
  // focus is stored as { userId : fieldId }
  remoteUserFieldFocus: {},
  remoteChangesInCurrentlyFocusedField: []
}

export const userSync = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.DOCUMENT_ROOM_USERS_RECEIVED: {
      const { documentId, userIds } = action
      const newState = {
        ...state,
        activeDocumentUsers: { ...state.activeDocumentUsers, [documentId]: userIds }
      }
      return newState
    }
    case ActionTypes.DOCUMENT_ROOM_JOINED: {
      const { documentId } = action
      const newState = { ...state, currentDocumentRoom: documentId }
      return newState
    }
    case ActionTypes.DOCUMENT_ROOM_LEFT: {
      const { documentId } = action
      if (state.currentDocumentRoom === documentId) {
        const newState = { ...state, currentDocumentRoom: null }
        return newState
      }
      return { ...state }
    }
    case ActionTypes.REMOTE_USER_FIELD_FOCUS_UPDATED: {
      const { userId, fieldId } = action
      // only update the focus state if user is connected to a document room
      if (state.currentDocumentRoom) {
        const newState = {
          ...state,
          remoteUserFieldFocus: {
            ...state.remoteUserFieldFocus,
            [userId]: fieldId
          }
        }
        return newState
      }
      return { ...state }
    }
    case ActionTypes.REMOTE_FIELD_CHANGE_EVENT_RECEIVED: {
      const { userId, fieldId, focusedFieldId } = action
      // for now, we're only logging changes to the currently focused field
      if (fieldId === focusedFieldId) {
        const remoteChangesInCurrentlyFocusedField = [
          ...state.remoteChangesInCurrentlyFocusedField,
          { userId, fieldId }
        ]
        const newState = {
          ...state,
          remoteChangesInCurrentlyFocusedField
        }
        return newState
      }
      return { ...state }
    }
    case ActionTypes.EMIT_JOIN_DOCUMENT_ROOM:
    case ActionTypes.EMIT_LEAVE_DOCUMENT_ROOM:
    case ActionTypes.EMIT_FIELD_FOCUS:
    case ActionTypes.FIELD_FOCUS_EMITTED:
    case ActionTypes.EMIT_FIELD_BLUR:
    case ActionTypes.FIELD_BLUR_EMITTED:
    case ActionTypes.EMIT_FIELD_CHANGE:
    case ActionTypes.FIELD_CHANGE_EMITTED:
      return { ...state }
    case ActionTypes.SOCKET_ERROR:
      // no need to log, that was done when module loaded, move on silently
      return { ...state }
    default:
      return { ...state }
  }
}