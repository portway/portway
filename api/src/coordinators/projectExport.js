import BusinessDocument from '../businesstime/document'

const getProjectExportData = async function(projectId, orgId) {
  console.log(projectId)
  const documents = await BusinessDocument.findAllForProject(projectId, orgId)
  
  const fullDocuments = await Promise.all(documents.map((document) => {
    return BusinessDocument.findByIdWithFields(document.id, orgId)
  }))

  console.log(fullDocuments)
}

export default {
  getProjectExportData
}