import Joi from 'joi'

export const rawSchema = {
  id: Joi.number(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  name: Joi.string(),
  email: Joi.string()
}

export default Joi.compile(rawSchema)