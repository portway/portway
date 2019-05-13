import ono from 'ono'
import Joi from 'joi'

import apiErrorTypes from '../../constants/apiErrorTypes'
import PUBLIC_MESSAGES from '../../constants/publicMessages'

// validation occurs on req.body
export function validateBody(schema, options = {}) {
  const { includeDetails, ...joiOptions } = options

  const defaultOptions = {
    allowUnknown: false,
    // if we're not including details in the validation error payload, abort on first validation error
    abortEarly: !includeDetails
  }

  const mergedOptions = Object.assign(defaultOptions, joiOptions)
  return (req, res, next) => {
    const { value, error } = Joi.validate(req.body, schema, mergedOptions)

    if (!error) {
      req.body = value
      return next()
    }

    const apiError = new ono({ code: 400, publicMessage: PUBLIC_MESSAGES.INVALID_PAYLOAD }, error.message)

    if (error.name === 'ValidationError' && includeDetails) {
      apiError.errorDetails = error.details.map((detail) => { return { message: detail.message, key: detail.context.key }})
      apiError.errorType = apiErrorTypes.ValidationError
    }

    next(apiError)
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

    const apiError = new ono({ code: 400, publicMessage: PUBLIC_MESSAGES.INVALID_PARAM }, error.message)

    next(apiError)
  }
}
