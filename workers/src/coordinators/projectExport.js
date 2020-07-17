import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { promisifyStreamPipe } from '../libs/utils'
import documentToMd from '../libs/documentToMd'
import zipIntegrator from '../integrators/zip'
import portwayAPI from '../integrators/portwayAPI'
import FIELD_TYPES from '../constants/fieldTypes'

const EXPORT_TEMP_DIRECTORY = process.env.EXPORT_TEMP_DIRECTORY

const getProjectExportData = async function (projectId, token) {
  console.info('getProjectExportData', projectId)

  const uniqueId = `${projectId}-${Date.now()}`
  const directoryPath = path.resolve(EXPORT_TEMP_DIRECTORY, uniqueId)

  // console.info('fetching docs')

  const documents = (await portwayAPI.fetchProjectDocuments(projectId, token)).data

  // console.info('received docs:')

  // console.info(JSON.stringify(documents, null, 2))

  // fetch all the docs with populated fields -- currently getting all draft docs
  const fullDocuments = await Promise.all(documents.map(async (document) => {
    return (await portwayAPI.fetchFullDocument(document.id, token)).data
  }))

  // create the markdown for each doc
  const mdDocs = fullDocuments.reduce((cur, doc) => {
    return { ...cur, [doc.slug || doc.id]: documentToMd(doc) }
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

  await zipIntegrator.compressDirectory(directoryPath, uniqueId, true, EXPORT_TEMP_DIRECTORY)
}

export default {
  getProjectExportData
}