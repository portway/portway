import BusinessField from '../businesstime/field'
import { FIELD_TYPES } from '../constants/fieldTypes'
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

const stat = util.promisify(fs.stat)

// EXPORTS

const addFieldToDocument = async function(documentId, body, file) {
  const { orgId } = body
  const fieldBody = await getFieldBodyByType(body, documentId, orgId, file)

  return BusinessField.createForDocument(documentId, fieldBody)
}

const addImageFieldFromUrlToDocument = async function(documentId, body, url) {
  const filePath = path.resolve(__dirname, `../../uploads/${documentId}-${Date.now()}`)

  const resp = await axios({ url, responseType: 'stream', method: 'get' })
  const writeStream = fs.createWriteStream(filePath)
  await promisifyStreamPipe(resp.data, writeStream)

  const fileStats = await callFuncWithArgs(stat, filePath)

  const urlParts = url.split('/')
  const name = urlParts[urlParts.length - 1]

  // This is mimic'ing multer's file object.
  // Not ideal to be passing the multer object around, but that's a larger rewrite to fix
  const file = {
    originalname: name,
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

  const fieldBody = await getFieldBodyByType({ ...body, type: field.type }, documentId, orgId, file)
  return BusinessField.updateByIdForDocument(fieldId, documentId, orgId, fieldBody)
}

const removeDocumentField = async function(fieldId, documentId, orgId) {
  const field = await BusinessField.findByIdForDocument(fieldId, documentId, orgId)
  await BusinessField.deleteByIdForDocument(fieldId, documentId, orgId)
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
      // set the meta data for file type, and pass through without break to upload in same manner as image
      if (file) {
        fieldBody.meta = { originalName: file.originalname, mimeType: file.mimetype, size: file.size }
      }
    case FIELD_TYPES.IMAGE:
      let url
      if (file) {
        url = await assetCoordinator.addAssetForDocument(documentId, orgId, file)
      }
      fieldBody.value = url
      break
    case FIELD_TYPES.TEXT:
      const inputBody = body.value || ''
      fieldBody.structuredValue = await processMarkdownSync(inputBody)
      break
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.NUMBER:
    // keep body the same
  }

  return fieldBody
}

const fieldCoordinator = {
  addFieldToDocument,
  addImageFieldFromUrlToDocument,
  updateDocumentField,
  removeDocumentField
}

export default fieldCoordinator