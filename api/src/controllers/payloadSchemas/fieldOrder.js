import Joi from 'joi'

export const rawSchema = {
  order: Joi.number().min(0)
}

export default Joi.compile(rawSchema)
