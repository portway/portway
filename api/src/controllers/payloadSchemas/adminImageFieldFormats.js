import Joi from '@hapi/joi'

export const rawSchema = {
  webp: Joi.object({
    half: Joi.string().uri(),
    full: Joi.string().uri()
  }),
  original: Joi.object({
    half: Joi.string().uri(),
    full: Joi.string().uri()
  })
}

export default Joi.compile(rawSchema)
