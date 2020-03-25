import Joi from '@hapi/joi'
import { MIN_PASSWORD_LENGTH } from '../../constants/password'

export const rawSchema = Joi.compile({
  password: Joi.string()
    .min(MIN_PASSWORD_LENGTH)
    .required(),
  joinNewsletter: Joi.boolean()
})

export default Joi.compile(rawSchema)