import BusinessDocument from '../businesstime/document'
import documentToMd from '../libs/documentToMd'
import fs from 'fs'

const getProjectExportData = async function(projectId, orgId) {
  const documents = await BusinessDocument.findAllForProject(projectId, orgId)
  
  const fullDocuments = await Promise.all(documents.map((document) => {
    return BusinessDocument.findByIdWithFields(document.id, orgId)
  }))

  const mdDocs = fullDocuments.map(documentToMd)
  await fs.promises.writeFile('./temp.md', mdDocs[0])
}

export default {
  getProjectExportData
}