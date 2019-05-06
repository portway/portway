import Joi from 'joi'
import PROJECT_ACCESS_LEVELS from '../../constants/projectAccessLevels'

export const rawSchema = {
  name: Joi.string(),
  description: Joi.string()
    .allow('')
    .allow(null),
  accessLevel: Joi.string()
    .valid(Object.values(PROJECT_ACCESS_LEVELS))
    .allow(null)
}

export default Joi.compile(rawSchema)
