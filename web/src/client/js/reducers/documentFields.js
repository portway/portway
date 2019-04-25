import { ActionTypes } from '../actions'
import { filterObject } from 'Shared/utilities'

const initialState = {
  // nested at { [documentId]: { [fieldId]: {} } }
  documentFieldsById: {},
  lastCreatedFieldId: null,
  loading: {
    byId: {},
    byDocument: {}
  }
}

export const documentFields = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_FIELDS: {
      const { documentId } = action
      const byDocument = { ...state.loading.byDocument, [documentId]: true }
      return { ...state, loading: { ...state.loading, byDocument } }
    }
    case ActionTypes.RECEIVE_FIELDS: {
      const documentId = action.documentId
      const byDocument = { ...state.loading.byDocument, [documentId]: false }
      const documentFieldsObject = action.data.reduce((object, doc) => {
        object[doc.id] = doc
        return object
      }, {})
      const documentFieldsById = { ...state.documentFieldsById, [documentId]: documentFieldsObject }
      return { ...state, documentFieldsById, loading: { ...state.loading, byDocument } }
    }
    case ActionTypes.RECEIVE_CREATED_FIELD: {
      const { id, docId } = action.data
      const documentFields = state.documentFieldsById[docId] || {}
      const documentFieldsById = {
        ...state.documentFieldsById,
        [docId]: { ...documentFields, [id]: action.data }
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
      const { id, docId } = action.data
      const documentFields = state.documentFieldsById[docId] || {}
      const documentFieldsById = {
        ...state.documentFieldsById,
        [docId]: { ...documentFields, [id]: action.data }
      }
      const lastCreatedFieldId = initialState.lastCreatedFieldId
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, documentFieldsById, lastCreatedFieldId, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.INITIATE_FIELD_ORDER: {
      // No change, early return
      if (oldOrder === newOrder) return state

      const { documentId, fieldId, newOrder } = action
      const documentFields = { ...state.documentFieldsById[documentId] }
      const { [fieldId]: fieldToUpdate, ...remainingFields } = documentFields
      // Set the new order on the dragged element
      const oldOrder = fieldToUpdate.order
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
    default:
      return state
  }
}
