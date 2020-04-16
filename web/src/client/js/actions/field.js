import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES, FIELD_TYPES } from 'Shared/constants'
import { Fields, Notifications, Validation } from './index'
import { fetchDocument } from './document'
import { add, update, remove, globalErrorCodes, validationCodes } from '../api'
import { fetchImageBlob } from 'Utilities/imageUtils'
import { emitFieldChange } from '../sockets/SocketProvider'

export const createField = (projectId, documentId, fieldType, body, socketDispatch) => {
  return async (dispatch) => {
    dispatch(Fields.initiateCreate(documentId, fieldType))
    let data
    let status
    const url = `v1/documents/${documentId}/fields`
    // if we're getting FormData here, it's a file upload, pass the FormData as the body
    if (body.value instanceof FormData) {
      ({ data, status } = await add(url, body.value))
    } else {
      ({ data, status } = await add(url, body))
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('field', data, status))
    } else {
      dispatch(Fields.receiveOneCreated(projectId, documentId, data))
      dispatch(Fields.setLastCreatedFieldId(data.id))
      return data
    }

    // if we want to sync users, pass in socketDispatch
    if (socketDispatch) {
      socketDispatch(emitFieldChange(socketDispatch, data.id, documentId))
    }
  }
}

export const updateField = (projectId, documentId, fieldId, body, socketDispatch) => {
  return async (dispatch) => {
    dispatch(Fields.initiateUpdate(documentId, fieldId))
    let data
    let status
    // if we're getting FormData here, it's a file upload, pass the FormData as the body
    if (body.value instanceof FormData) {
      ({ data, status } = await update(`v1/documents/${documentId}/fields/${fieldId}`, body.value))
    } else {
      ({ data, status } = await update(`v1/documents/${documentId}/fields/${fieldId}`, body))
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.FIELD, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('field', data, status)) :
      dispatch(Fields.receiveOneUpdated(projectId, documentId, fieldId, data))
    // if we want to sync users, pass in socketDispatch
    if (socketDispatch) {
      socketDispatch(emitFieldChange(socketDispatch, fieldId, documentId))
    }
  }
}

export const updateFieldOrder = (documentId, fieldId, newOrder, fetch = false, socketDispatch) => {
  return async (dispatch) => {
    dispatch(Fields.initiateOrderUpdate(documentId, fieldId, newOrder))
    await update(`v1/documents/${documentId}/fields/${fieldId}/order`, { order: newOrder })
    if (fetch) {
      dispatch(fetchDocument(documentId))
    }
    if (socketDispatch) {
      socketDispatch(emitFieldChange(socketDispatch, fieldId, documentId))
    }
    return newOrder
  }
}

export const removeField = (projectId, documentId, fieldId, socketDispatch) => {
  return async (dispatch) => {
    dispatch(Fields.initiateRemove())
    const { data, status } = await remove(`v1/documents/${documentId}/fields/${fieldId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.FIELD, status))
      return
    }
    dispatch(Fields.removeOne(projectId, documentId, fieldId))
    // if we want to sync users, pass in socketDispatch
    if (socketDispatch) {
      socketDispatch(emitFieldChange(socketDispatch, fieldId, documentId))
    }
  }
}

export const blurField = (fieldId, fieldType, fieldData) => {
  return async (dispatch) => {
    dispatch(Fields.blurField(fieldId, fieldType, fieldData))
  }
}

export const focusField = (fieldId, fieldType, fieldData) => {
  return async (dispatch) => {
    dispatch(Fields.focusField(fieldId, fieldType, fieldData))
  }
}

export const setLastCreatedFieldId = (fieldId) => {
  return async (dispatch) => {
    dispatch(Fields.setLastCreatedFieldId(fieldId))
  }
}

export const removeLastCreatedFieldId = (fieldId) => {
  return async (dispatch) => {
    dispatch(Fields.removeLastCreatedFieldId(fieldId))
  }
}

/**
 * Creates a new field in newDocumentId using an existing field's data
 * Then removes that field from the currentDocumentId
 * This is triggered by dragging a field to a document in the list without the
 * modifier key (option/alt) held
 */
export const moveField = (projectId, currentDocumentId, newDocumentId, field) => {
  return async (dispatch) => {
    const body = await _getFieldBody(field)
    dispatch(Fields.initiateMove(projectId, currentDocumentId, newDocumentId, field.id))
    await createField(projectId, newDocumentId, field.type, body)(dispatch)
    await removeField(projectId, currentDocumentId, field.id)(dispatch)
    dispatch(Fields.movedField(projectId, currentDocumentId, newDocumentId, field.id))
  }
}

/**
 * Copies an existing field to newDocumentId
 * This is triggered by dragging a field to a document in the list with the
 * modifier key (option/alt) held
 */
export const copyField = (projectId, currentDocumentId, newDocumentId, field) => {
  return async (dispatch) => {
    const body = await _getFieldBody(field)
    dispatch(Fields.initiateCopy(projectId, currentDocumentId, newDocumentId, field.id))
    await createField(projectId, newDocumentId, field.type, body)(dispatch)
    dispatch(Fields.copiedField(projectId, currentDocumentId, newDocumentId, field.id))
  }
}

export const createNewFieldWithTheSplitOfThePreviousFieldAndReOrderThemAppropriately = (
  documentId,
  fieldId,
  editor,
  fieldWithCursorOrder,
  newFieldName,
  fieldType,
  newSplitTextName
) => {
  return async (dispatch) => {
    const currLine = editor.getCursor().line
    const currChar = editor.getCursor().ch
    const lastLine = editor.lastLine()
    const lastLineContent = editor.getLine(lastLine)

    let splitFieldData = null
    let newSplitField = null

    // Get the selection of the field after the current cursor pos
    const zeroRange = { line: 0, ch: 0 }
    const startRange = { line: currLine, ch: currChar }
    const endRange = { line: lastLine, ch: lastLineContent.length }

    // Save the text after the cursor
    const textBeforeCursor = editor.getRange(zeroRange, startRange)
    const textAfterCursor = editor.getRange(startRange, endRange)

    // Create the new field
    const { data: newField, status: newFieldStatus } = await add(`v1/documents/${documentId}/fields`, { name: newFieldName, type: fieldType })
    if (globalErrorCodes.includes(newFieldStatus)) {
      dispatch(Notifications.create(newField.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }

    if (textAfterCursor !== '') {
      // Create the new split text field
      splitFieldData = {
        name: newSplitTextName,
        type: FIELD_TYPES.TEXT,
        value: textAfterCursor,
      }
      const { data: newSplitFieldData, status: newSplitFieldStatus } = await add(`v1/documents/${documentId}/fields`, splitFieldData)
      if (globalErrorCodes.includes(newSplitFieldStatus)) {
        dispatch(Notifications.create(newField.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
        return
      }
      newSplitField = newSplitFieldData
    }

    // Manually update the current textfield
    await update(`v1/documents/${documentId}/fields/${fieldId}`, { value: textBeforeCursor })

    // Re-order the two new fields
    await update(`v1/documents/${documentId}/fields/${newField.id}/order`, { order: fieldWithCursorOrder + 1 })
    if (textAfterCursor !== '') {
      await update(`v1/documents/${documentId}/fields/${newSplitField.id}/order`, { order: fieldWithCursorOrder + 2 })
    }

    // Replace the text
    // removed this and am manually calling the field update API so we don't get an onChange
    // editor.replaceRange('', startRange, endRange)

    // Fetch the document for a total re-render now that we have everything set up
    dispatch(fetchDocument(documentId))
    dispatch(Fields.setLastCreatedFieldId(newField.id))
  }
}

const _getFieldBody = async function(field) {
  let body = {
    name: field.name,
    type: field.type,
    value: field.value
  }
  if (field.type === FIELD_TYPES.IMAGE) {
    let imageData
    if (field.value) {
      imageData = await fetchImageBlob(field.value)
    }
    body = new FormData()
    body.set('name', field.name)
    body.set('type', field.type)
    body.set('file', imageData)
  }
  return body
}
