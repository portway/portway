import BusinessField from '../businesstime/field'
import { FIELD_TYPES, FIELD_PROPS_TO_COPY } from '../constants/fieldTypes'
import { processMarkdownSync } from './markdown'
import assetCoordinator from './assets'
import { callFuncWithArgs } from '../libs/utils'
import promisifyStreamPipe from '../libs/promisifyStreamPipe'
import fs from 'fs'
import path from 'path'
import util from 'util'
import ono from 'ono'
import axios from 'axios'
import { lookup } from 'mime-types'
import logger from '../integrators/logger'
import { LOG_LEVELS } from '../constants/logging'
import jobQueue from '../integrators/jobQueue'
import sharp from 'sharp'
import { getRenderedValueByType } from '../libs/fieldRenderedValue'
import fieldSchema from '../controllers/payloadSchemas/field'
import joiErrorToApiError from '../libs/joiErrorToApiError'

const stat = util.promisify(fs.stat)

// EXPORTS

const addFieldToDocument = async function(documentId, body, file) {
  const { orgId } = body
  const fieldBody = await getFieldBodyByType(body, documentId, orgId, file)

  let field = await BusinessField.createForDocument(documentId, fieldBody)

  // set the rendered value on the field
  if (field.value != null) {
    const renderedValue = await getRenderedValueByType(field, field.value)
    field = await BusinessField.updateByIdForDocument(field.id, field.documentId, orgId, { renderedValue })
  }

  // if it's an image field and has a file, kick off job to generate additional image sizes and store the data on field
  if (file && field.type === FIELD_TYPES.IMAGE) {
    jobQueue.runImageProcessing(field.value, field.documentId, field.id, orgId)
  }

  return field
}

const addAssetFieldFromUrlToDocument = async function(documentId, body, url) {
  const filePath = path.resolve(__dirname, `../../uploads/${documentId}-${Date.now()}`)

  const resp = await axios({ url, responseType: 'stream', method: 'get' })
  const writeStream = fs.createWriteStream(filePath)
  await promisifyStreamPipe(resp.data, writeStream)

  const fileStats = await callFuncWithArgs(stat, filePath)

  const urlPath = path.parse(url)
  // truncate the file name
  const truncatedName = `${urlPath.name.slice(0, 13)}${urlPath.ext}`

  // This is mimic'ing multer's file object.
  // Not ideal to be passing the multer object around, but that's a larger rewrite to fix
  const file = {
    originalname: truncatedName,
    mimetype: lookup(url),
    path: filePath,
    size: fileStats.size
  }

  const result = await fieldCoordinator.addFieldToDocument(documentId, body, file)
  try {
    fs.unlink(filePath, () => {}) // don't need to await
  } catch (e) {
    logger(LOG_LEVELS.ERROR, e)
  }
  return result
}

const updateDocumentField = async function(fieldId, documentId, orgId, body, file) {
  const field = await BusinessField.findByIdForDocument(fieldId, documentId, orgId)

  if (!field) throw ono({ code: 404 }, `Cannot update, field not found with id: ${fieldId}`)

  // when we update a field value, we need to validate its value against its type, which won't usually be passed in the update body,
  // so won't be handled in the controller body validator
  // we have the original field and type at this point, so we can validate the value
  // NOTE: this will always result in error details being passed to the calling controller,
  // if we don't want these included in the payload, remove them there before sending

  if (body.value) {
    const { error } = fieldSchema.validate({ ...body, type: field.type })
    if (error && error.name === 'ValidationError') {
      throw joiErrorToApiError(error, true)
    }
  }

  const fieldBody = await getFieldBodyByType({ ...body, type: field.type }, documentId, orgId, file)

  let updatedField = await BusinessField.updateByIdForDocument(fieldId, documentId, orgId, fieldBody)

  // set the rendered value on the field
  if (updatedField.value != null) {
    const renderedValue = await getRenderedValueByType(updatedField, updatedField.value)
    updatedField = await BusinessField.updateByIdForDocument(updatedField.id, updatedField.documentId, orgId, { renderedValue })
  }

  // if it's an image field and has a file, kick off job to generate additional image sizes and store the data on field
  if (updatedField.type === FIELD_TYPES.IMAGE && file) {
    jobQueue.runImageProcessing(updatedField.value, updatedField.documentId, updatedField.id, orgId)
  }

  return updatedField
}

/*
 * options = {
 *   deletePublished: true // ignores published status of field when deleting field
 *   markUpdated: true/false // whether to mark parent document and project as updated
 * }
 */
const removeDocumentField = async function(fieldId, documentId, orgId, options) {
  const field = await BusinessField.findByIdForDocument(fieldId, documentId, orgId)
  await BusinessField.deleteByIdForDocument(fieldId, documentId, orgId, options)
  // async, but don't wait for it
  cleanupFieldByType(field, orgId)
}

// HELPERS

// Handles cleanup based on the field type
const cleanupFieldByType = async function(field, orgId) {
  switch (field.type) {
    case FIELD_TYPES.IMAGE:
    case FIELD_TYPES.FILE: {
      await assetCoordinator.deleteAsset(field.value, orgId)
    }
  }
}

const getFieldBodyByType = async function(body, documentId, orgId, file) {
  const fieldBody = { ...body }

  switch (body.type) {
    case FIELD_TYPES.FILE:
      if (file) {
        // set the meta data for file type
        fieldBody.meta = { originalName: file.originalname, mimeType: file.mimetype, size: file.size }
        const url = await assetCoordinator.addAssetForDocument(documentId, orgId, file)
        fieldBody.value = url
      }
      break
    case FIELD_TYPES.IMAGE:
      if (file) {
        const cleanFilePath = path.resolve(__dirname, `../../uploads/${documentId}-${Date.now()}`)
        const cleanImageInfo = await sharp(file.path).toFile(cleanFilePath)

        // for svgs, use the original file, not the sharp-processed image
        // using the processed image was resulting in corrupted svg data
        // we're still using the returned cleanImageInfo for svg metadata like width and height though
        const fileLocation = file.mimetype === 'image/svg+xml' ? file.path : cleanFilePath
      
        const url = await assetCoordinator.addAssetForDocument(documentId, orgId, { ...file, path: fileLocation, size: cleanImageInfo.size })
        fieldBody.value = url
        fieldBody.meta = { width: cleanImageInfo.width, height: cleanImageInfo.height }
        // always clear out the field formats, this will get updated by a worker later
        fieldBody.formats = null
      }
      break
    case FIELD_TYPES.TEXT:
      const inputBody = body.value || ''
      fieldBody.structuredValue = await processMarkdownSync(inputBody)
      break
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.DATE:
    // keep body the same
  }
  return fieldBody
}

const duplicateField = async function(id, originalParentDocId, newParentDocId, orgId) {
  const field = await BusinessField.findByIdForDocument(id, originalParentDocId, orgId)

  const body = FIELD_PROPS_TO_COPY.reduce((body, fieldProp) => {
    body[fieldProp] = field[fieldProp]
    return body
  }, {})
  body.orgId = orgId
  console.log(body)
  if (body.type === FIELD_TYPES.IMAGE || body.type === FIELD_TYPES.FILE && body.value) {
    return fieldCoordinator.addAssetFieldFromUrlToDocument(newParentDocId, body, body.value)
  } else if (body.type === FIELD_TYPES.DATE && typeof body.value === 'object' && body.value) {
    body.value = body.value.toISOString()
  }

  return BusinessField.createForDocument(newParentDocId, body)
}

const fieldCoordinator = {
  addFieldToDocument,
  addAssetFieldFromUrlToDocument,
  updateDocumentField,
  removeDocumentField,
  duplicateField
}

export default fieldCoordinator