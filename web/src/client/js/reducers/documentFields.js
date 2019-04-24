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
      const { documentId, fieldId, newOrder } = action
      const documentFields = { ...state.documentFieldsById[documentId] }
      const fieldToUpdate = { ...state.documentFieldsById[documentId][fieldId] }
      // Set the new order on the dragged element
      const oldOrder = fieldToUpdate.order
      fieldToUpdate.order = newOrder
      // Adjust the fields between the newOrder and oldOrder range
      const updatedFields = { [fieldId]: fieldToUpdate }
      if (oldOrder > newOrder) {
        // move everything from newOrder to oldOrder up
        const fieldsToMove = filterObject(documentFields, field => field.order >= newOrder && field.order < oldOrder)
        Object.keys(fieldsToMove).forEach((key) => {
          if (key === fieldId) return
          const updatedField = { ...documentFields[key], order: documentFields[key].order + 1 }
          updatedFields[key] = updatedField
        })
      } else {
        // move everything from oldOrder to newOrder down
        const fieldsToMove = filterObject(documentFields, field => field.order >= oldOrder && field.order <= newOrder)
        Object.keys(fieldsToMove).forEach((key) => {
          if (key === fieldId) return
          const updatedField = { ...documentFields[key], order: documentFields[key].order - 1 }
          updatedFields[key] = updatedField
        })
      }
      // Merge fields
      Object.keys(updatedFields).forEach((fieldKey) => {
        documentFields[fieldKey] = updatedFields[fieldKey]
      })
      return {
        ...state,
        documentFieldsById: {
          ...state.documentFieldsById,
          [documentId]: documentFields
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
