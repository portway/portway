import Joi from 'joi'

export const rawSchema = {
  name: Joi.string()
}

export default Joi.compile(rawSchema)
