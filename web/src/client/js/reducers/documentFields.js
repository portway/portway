import { ActionTypes } from '../actions'

const initialState = {
  // nested at { [documentId]: { [fieldId]: {} } }
  documentFieldsById: {},
  lastCreatedFieldId: null,
  focused: {
    id: null,
    type: null,
    data: null,
  },
  loading: {
    byId: {},
    byDocument: {}
  }
}

export const documentFields = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_DOCUMENT: {
      const { documentId } = action
      const byDocument = { ...state.loading.byDocument, [documentId]: true }
      return { ...state, loading: { ...state.loading, byDocument } }
    }
    case ActionTypes.RECEIVE_DOCUMENT: {
      const documentId = action.data.id
      const byDocument = { ...state.loading.byDocument, [documentId]: false }
      const documentFieldsObject = action.data.fields.reduce((object, field) => {
        object[field.id] = field
        return object
      }, {})
      const documentFieldsById = { ...state.documentFieldsById, [documentId]: documentFieldsObject }
      return { ...state, documentFieldsById, loading: { ...state.loading, byDocument } }
    }
    case ActionTypes.RECEIVE_CREATED_FIELD: {
      const { id, documentId } = action.data
      const documentFields = state.documentFieldsById[documentId] || {}
      const documentFieldsById = {
        ...state.documentFieldsById,
        [documentId]: { ...documentFields, [id]: action.data }
      }
      const lastCreatedFieldId = id
      return { ...state, documentFieldsById, lastCreatedFieldId }
    }
    case ActionTypes.INITIATE_FIELD_UPDATE: {
      const { fieldId } = action
      const loadingById = { ...state.loading.byId, [fieldId]: true }
      return { ...state, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.RECEIVE_UPDATED_FIELD: {
      const { id, documentId } = action.data
      const documentFields = state.documentFieldsById[documentId] || {}
      const documentFieldsById = {
        ...state.documentFieldsById,
        [documentId]: { ...documentFields, [id]: action.data }
      }
      const lastCreatedFieldId = initialState.lastCreatedFieldId
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, documentFieldsById, lastCreatedFieldId, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.INITIATE_FIELD_ORDER: {
      const { documentId, fieldId, newOrder } = action
      const documentFields = { ...state.documentFieldsById[documentId] }
      const { [fieldId]: fieldToUpdate, ...remainingFields } = documentFields
      const oldOrder = fieldToUpdate.order

      // No change, early return
      if (oldOrder === newOrder) return { ...state }

      // Set the new order on the dragged element
      const updatedField = { ...fieldToUpdate, order: newOrder }
      const updatedFields = { [fieldId]: updatedField }

      if (newOrder < oldOrder) {
        // move everything from newOrder to oldOrder up
        Object.keys(remainingFields).forEach((key) => {
          const field = remainingFields[key]
          if (field.order >= newOrder && field.order < oldOrder) {
            updatedFields[field.id] = { ...field, order: field.order + 1 }
            return
          }
          updatedFields[field.id] = { ...field }
        })
      } else {
        // move everything from oldOrder to newOrder down
        Object.keys(remainingFields).forEach((key) => {
          const field = remainingFields[key]
          if (field.order > oldOrder && field.order <= newOrder) {
            updatedFields[field.id] = { ...field, order: field.order - 1 }
            return
          }
          updatedFields[field.id] = { ...field }
        })
      }

      return {
        ...state,
        documentFieldsById: {
          ...state.documentFieldsById,
          [documentId]: updatedFields
        }
      }
    }
    case ActionTypes.INITIATE_FIELD_REMOVE: {
      const { id } = action
      const loadingById = { ...state.loading.byId, [id]: true }
      return { ...state, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.REMOVE_FIELD: {
      const { documentId, fieldId } = action
      const documentFields = state.documentFieldsById[documentId] || {}
      // eslint-disable-next-line no-unused-vars
      const { [fieldId]: __, ...restDocumentFields } = documentFields
      const loadingById = { ...state.loading.byId, [fieldId]: false }
      const lastCreatedFieldId = initialState.lastCreatedFieldId
      const documentFieldsById = { ...state.documentFieldsById, [documentId]: restDocumentFields }
      return { ...state, documentFieldsById, lastCreatedFieldId, loading: { ...state.loading, byId: loadingById } }
    }
    // Blur field resets focus data
    case ActionTypes.BLUR_FIELD: {
      const focused = { ...state.focused }
      focused.id = null
      focused.type = null
      focused.data = null
      return { ...state, focused }
    }
    // Focus field tracks field ID and certain data per type of field
    // This is so we can interact with the actual field component or ref from
    // somewhere else within the app
    case ActionTypes.FOCUS_FIELD: {
      const { fieldId, fieldData, fieldType } = action
      const focused = { ...state.focused }
      focused.id = fieldId
      focused.type = fieldType
      focused.data = fieldData
      return { ...state, focused }
    }
    default:
      return state
  }
}
