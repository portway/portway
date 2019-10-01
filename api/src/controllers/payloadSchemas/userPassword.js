import Joi from 'joi'

export const rawSchema = {
  currentPassword: Joi.string(),
  newPassword: Joi.string(),
  confirmNewPassword: Joi.string()
}

export default Joi.compile(rawSchema)
