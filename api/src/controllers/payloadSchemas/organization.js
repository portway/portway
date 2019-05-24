import Joi from 'joi'

export const rawSchema = {
  name: Joi.string(),
  allowUserProjectCreation: Joi.bool()
}

export default Joi.compile(rawSchema)