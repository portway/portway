import Joi from 'joi'

// Assumes validation occurs on req.body
export default function validate(schema, options = {}) {
  const defaultOptions = {
    allowUnknown: false
  }

  const mergedOptions = Object.assign(defaultOptions, options)
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema, mergedOptions)

    if (!error) {
      return next()
    }

    res.status(400).send('Invalid request payload input')
  }
}
