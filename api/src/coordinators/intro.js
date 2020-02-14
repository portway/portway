import BusinessProject from '../businesstime/project'
import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import { getProject, getProjectDocuments, getDocumentWithFields } from '../integrators/portway'
import fieldCoordinator from './field'
import { INTRO_PROJECT_ID } from '../constants/intro'
import PROJECT_ACCESS_LEVELS from '../constants/projectAccessLevels'
import { FIELD_TYPES } from '../constants/fieldTypes'

const READ_KEY = process.env.PORTWAY_INTRO_PROJECT_READ_KEY
const fieldPropsToCopy = ['type', 'value', 'order', 'name']

const copyIntroProjectToOrg = async (orgId) => {
  const project = await getProject(INTRO_PROJECT_ID, READ_KEY)

  const newProject = await BusinessProject.create({
    orgId,
    name: project.name,
    accessLevel: PROJECT_ACCESS_LEVELS.READ
  })

  const docs = await getProjectDocuments(INTRO_PROJECT_ID, READ_KEY)

  return Promise.all(docs.map(async (doc) => {
    const docWithFields = await getDocumentWithFields(doc.id, READ_KEY)
    const newDoc = await BusinessDocument.createForProject(newProject.id, {
      name: docWithFields.name,
      orgId
    })

    docWithFields.fields.reduce(async (fieldCreatePromise, field) => {
      await fieldCreatePromise // make sure the fields are created in order
      const body = fieldPropsToCopy.reduce((body, fieldProp) => {
        body[fieldProp] = field[fieldProp]
        return body
      }, {})
      body.orgId = orgId

      if (body.type === FIELD_TYPES.IMAGE) {
        return fieldCoordinator.addImageFieldFromUrlToDocument(newDoc.id, body, field.value)
      }
      return BusinessField.createForDocument(newDoc.id, body)
    }, Promise.resolve())
  }))
}

export default {
  copyIntroProjectToOrg
}