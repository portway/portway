import Joi from 'joi'
import RESOURCE_TYPES from '../../constants/resourceTypes'
import * as user from './user'
import * as projectUser from './projectUser'

const resourceToSchema = {
  [RESOURCE_TYPES.USER]: user,
  [RESOURCE_TYPES.PROJECT_USER]: projectUser
}

/**
 * Use the baseSchema of a resource and force given fields to
 * be required
 * @param {String} resource the resource name
 * @param  {...String} fields field names found in schema to force as required
 * @return {Joi Schema} schema the compiled schema with required fields
 */
const requiredFields = (resource, ...fields) => {
  if (!resourceToSchema.hasOwnProperty(resource)) {
    throw new Error(
      `Resource ${resource} does not have a defined payloadSchema.` +
      'Import the payloadSchema to payloadSchemas/helpers'
    )
  }

  const rawSchema = resourceToSchema[resource].rawSchema
  const schema = { ...rawSchema }
  fields.forEach((field) => {
    if (schema.hasOwnProperty(field)) {
      schema[field] = schema[field].required()
    } else {
      throw new Error(`Field ${field} not found on payloadschema user`)
    }
  })
  return Joi.compile(schema)
}

export {
  requiredFields
}