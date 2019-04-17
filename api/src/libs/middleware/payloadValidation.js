import Joi from 'joi'
import { isContext } from 'vm';

// validation occurs on req.body
export function validateBody(schema, options = {}) {
  const defaultOptions = {
    allowUnknown: false,
    abortEarly: false
  }

  const mergedOptions = Object.assign(defaultOptions, options)
  return (req, res, next) => {
    const { value, error } = Joi.validate(req.body, schema, mergedOptions)

    if (!error) {
      req.body = value
      return next()
    }
    console.error(error)

    const errorPayload = { error: 'Invalid request payload input' }

    if (error.name === 'ValidationError') {
      errorPayload.details = error.details.map((detail) => { return { message: detail.message, key: detail.context.key }})
    }

    res.status(400).send(errorPayload)
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
