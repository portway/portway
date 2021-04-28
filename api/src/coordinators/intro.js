import BusinessProject from '../businesstime/project'
import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessProjectUser from '../businesstime/projectuser'
import BusinessOrganization from '../businesstime/organization'
import { getProject, getProjectDocuments, getDocumentWithFields } from '../integrators/portway'
import fieldCoordinator from './field'
import { INTRO_PROJECT_ID } from '../constants/intro'
import PROJECT_ACCESS_LEVELS from '../constants/projectAccessLevels'
import { FIELD_TYPES, FIELD_PROPS_TO_COPY } from '../constants/fieldTypes'
import { PROJECT_ROLE_IDS } from '../constants/roles'

const READ_KEY = process.env.PORTWAY_INTRO_PROJECT_READ_KEY

const copyIntroProjectToOrg = async (orgId) => {
  const project = await getProject(INTRO_PROJECT_ID, READ_KEY)

  const newProject = await BusinessProject.create({
    orgId,
    name: project.name,
    accessLevel: PROJECT_ACCESS_LEVELS.READ
  })

  await Promise.all([
    addUserAsAdminToProject(orgId, newProject.id),
    BusinessOrganization.updateById(orgId, { introProjectId: newProject.id })
  ])

  const docs = await getProjectDocuments(INTRO_PROJECT_ID, READ_KEY)

  return Promise.all(docs.map(async (doc) => {
    const docWithFields = await getDocumentWithFields(doc.id, READ_KEY)
    const newDoc = await BusinessDocument.createForProject(newProject.id, {
      name: docWithFields.name,
      orgId
    })

    docWithFields.fields.reduce(async (fieldCreatePromise, field) => {
      await fieldCreatePromise // make sure the fields are created in order
      const body = FIELD_PROPS_TO_COPY.reduce((body, fieldProp) => {
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

async function addUserAsAdminToProject(orgId, projectId) {
  const org = await BusinessOrganization.findSanitizedById(orgId)
  return BusinessProjectUser.addUserIdToProject(
    org.ownerId,
    projectId,
    PROJECT_ROLE_IDS.ADMIN,
    orgId
  )
}

export default {
  copyIntroProjectToOrg
}