import Joi from 'joi'
import RESOURCE_TYPES from '../../constants/resourceTypes'
import * as user from './user'
import * as projectUser from './projectUser'
import * as projectToken from './projectToken'
import * as project from './project'
import * as field from './field'
import * as document from './document'
const resourceToSchema = {
  [RESOURCE_TYPES.USER]: user,
  [RESOURCE_TYPES.PROJECT_USER]: projectUser,
  [RESOURCE_TYPES.DOCUMENT]: document,
  [RESOURCE_TYPES.FIELD]: field,
  [RESOURCE_TYPES.PROJECT]: project,
  [RESOURCE_TYPES.PROJECT_TOKEN]: projectToken
}

/**
 * Use the baseSchema of a resource and force given fields to
 * be required
 * @param {String} resource the resource name
 * @param  {...String} fields field names found in schema to force as required
 * @return {Joi Schema} schema the compiled schema with required fields
 */
const requiredFields = (resource, ...fields) => {
  verifyResource(resource)

  const rawSchema = resourceToSchema[resource].rawSchema
  const schema = { ...rawSchema }
  fields.forEach((field) => {
    if (schema.hasOwnProperty(field)) {
      schema[field] = schema[field].required()
    } else {
      throw new Error(`Field ${field} not found on payloadschema ${resource}`)
    }
  })
  return Joi.compile(schema)
}

/**
 * Use the baseSchema of a resource and limit the fields for validation
 * be required
 * @param {String} resource the resource name
 * @param  {...String} fields field names found in schema to use in validation
 * @return {Joi Schema} schema the compiled schema with included fields
 */
const partialFields = (resource, ...fields) => {
  verifyResource(resource)

  const rawSchema = resourceToSchema[resource].rawSchema
  const schema = fields.reduce((partialSchema, field) => {
    if (rawSchema.hasOwnProperty(field)) {
      partialSchema[field] = rawSchema[field]
    } else {
      throw new Error(`Field ${field} not found on payloadschema ${resource}`)
    }
    return partialSchema
  }, {})

  return Joi.compile(schema)
}

const verifyResource = (resource) => {
  if (!resourceToSchema.hasOwnProperty(resource)) {
    throw new Error(
      `Resource ${resource} does not have a defined payloadSchema.` +
        'Import the payloadSchema to payloadSchemas/helpers'
    )
  }
}

export { requiredFields, partialFields }
