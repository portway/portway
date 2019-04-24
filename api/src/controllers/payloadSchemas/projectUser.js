import Joi from 'joi'

export const rawSchema = {
  userId: Joi.number(),
  projectId: Joi.number(),
  roleId: Joi.number()
}

export default Joi.compile(rawSchema)
