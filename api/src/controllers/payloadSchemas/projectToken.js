import Joi from '@hapi/joi'

export const rawSchema = {
  roleId: Joi.number(),
  projectId: Joi.number(),
  name: Joi.string()
}

export default Joi.compile(rawSchema)
