import Joi from 'joi'

export const rawSchema = {
  roleId: Joi.number(),
  projectId: Joi.number(),
  name: Joi.string()
}

export default Joi.compile(rawSchema)
