import Joi from 'joi'

// validation occurs on req.body
export function validateBody(schema, options = {}) {
  const defaultOptions = {
    allowUnknown: false
  }

  const mergedOptions = Object.assign(defaultOptions, options)
  return (req, res, next) => {
    const { value, error } = Joi.validate(req.body, schema, mergedOptions)

    if (!error) {
      req.body = value
      return next()
    }
    console.error(error)
    res.status(400).send('Invalid request payload input')
  }
}

// validation occurs on req.params
export function validateParams(schema, options = {}) {
  const defaultOptions = {
    allowUnknown: false
  }

  const mergedOptions = Object.assign(defaultOptions, options)
  return (req, res, next) => {
    const { value, error } = Joi.validate(req.params, schema, mergedOptions)

    if (!error) {
      req.params = value
      return next()
    }

    res.status(400).send('Invalid request')
  }
}
