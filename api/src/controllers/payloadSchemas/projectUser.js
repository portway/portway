import Joi from 'joi'

export const rawSchema = {
  userId: Joi.string(),
  projectId: Joi.string(),
  roleId: Joi.string()
}

export default Joi.compile(rawSchema)
