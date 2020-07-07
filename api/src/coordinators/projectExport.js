import BusinessDocument from '../businesstime/document'
import documentToMd from '../libs/documentToMd'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { FIELD_TYPES } from '../constants/fieldTypes'
import { promisifyStreamPipe } from '../libs/utils'
import zipIntegrator from '../integrators/zip'

const getProjectExportData = async function(projectId, orgId) {
  const directoryPath = path.resolve(__dirname, `../../uploads/${projectId}-${Date.now()}`)

  const documents = await BusinessDocument.findAllForProject(projectId, orgId)

  // fetch all the docs with populated fields -- currently getting all draft docs
  const fullDocuments = await Promise.all(documents.map((document) => {
    return BusinessDocument.findByIdWithFields(document.id, orgId)
  }))

  // create the markdown for each doc
  const mdDocs = fullDocuments.reduce((cur, doc) => {
    return { ...cur, [doc.id]: documentToMd(doc)}
  }, {})

  // create the temporary project export directory
  await fs.promises.mkdir(directoryPath)
  // create the assets directory
  await fs.promises.mkdir(path.resolve(directoryPath, 'assets'))

  // write the markdown to .md files in the temp directory
  await Promise.all(Object.keys(mdDocs).map((key) => {
    return fs.promises.writeFile(path.resolve(directoryPath, `${key}.md`), mdDocs[key])
  }))

  // fetch any assets and add them to the assets sub-directory
  await Promise.all(fullDocuments.map((doc) => {
    return Promise.all(doc.fields.map(async (field) => {
      if (field.type === FIELD_TYPES.IMAGE || field.type === FIELD_TYPES.FILE) {
        const splitFileUrl = field.value.split('/')
        const filename = splitFileUrl[splitFileUrl.length - 1]
        const resp = await axios({ url: field.value, responseType: 'stream', method: 'get' })
        const fullFilePath = `${directoryPath}/assets/${filename}`
        const writeStream = fs.createWriteStream(fullFilePath)
        return promisifyStreamPipe(resp.data, writeStream)
      }
    }))
  }))

  await zipIntegrator.compressDirectory(directoryPath, `${Date.now()}`, true)
}

export default {
  getProjectExportData
}