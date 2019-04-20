import Joi from 'joi'

export const rawSchema = {
  order: Joi.number()
}

export default Joi.compile(rawSchema)
