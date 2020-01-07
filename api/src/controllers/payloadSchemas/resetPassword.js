import Joi from 'joi'

export const rawSchema = {
  email: Joi.email()
}

export default Joi.compile(rawSchema)
