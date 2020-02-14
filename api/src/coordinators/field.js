import BusinessField from '../businesstime/field'
import { FIELD_TYPES } from '../constants/fieldTypes'
import { processMarkdownWithWorker } from './markdown'
import assetCoordinator from './assets'
import { promisifyStreamPipe, callFuncWithArgs } from '../libs/utils'
import fs from 'fs'
import path from 'path'
import util from 'util'
import ono from 'ono'
import axios from 'axios'
import { lookup } from 'mime-types'

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

  return fieldCoordinator.addFieldToDocument(documentId, body, file)
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
    case FIELD_TYPES.IMAGE: {
      await assetCoordinator.deleteAsset(field.value, orgId)
    }
  }
}

const getFieldBodyByType = async function(body, documentId, orgId, file) {
  const fieldBody = { ...body }

  switch (body.type) {
    case FIELD_TYPES.IMAGE:
      let url
      if (file) {
        url = await assetCoordinator.addAssetForDocument(documentId, orgId, file)
      }
      fieldBody.value = url
      break
    case FIELD_TYPES.TEXT:
      const inputBody = body.value || ''
      fieldBody.structuredValue = await processMarkdownWithWorker(inputBody)
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