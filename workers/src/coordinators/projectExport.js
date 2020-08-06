import fs from 'fs'
import path from 'path'
import axios from 'axios'
import moment from 'moment'
import { promisifyStreamPipe } from '../libs/utils'
import documentToMd from '../libs/documentToMd'
import zipIntegrator from '../integrators/zip'
import portwayAPI from '../integrators/portwayAPI'
import FIELD_TYPES from '../constants/fieldTypes'
import { uploadExportZip } from '../integrators/s3'

const EXPORT_TEMP_DIRECTORY = process.env.EXPORT_TEMP_DIRECTORY || 'temp/'

const getProjectExportData = async function (projectId, token) {
  const project = (await portwayAPI.fetchProject(projectId, token)).data

  // Temporary slugification
  const name = project.name.toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '')

  const d = moment().format('YYYY-MM-DD_ss')
  const uniqueId = `${name}_${d}_${projectId}`
  const directoryPath = path.resolve(EXPORT_TEMP_DIRECTORY, uniqueId)

  const documents = (await portwayAPI.fetchProjectDocuments(projectId, token)).data

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

  const zipFileLocation = await zipIntegrator.compressDirectory(directoryPath, uniqueId, true, EXPORT_TEMP_DIRECTORY)

  const s3Location = await uploadExportZip(zipFileLocation, uniqueId)
  return s3Location
}

export default {
  getProjectExportData
}
