import ono from 'ono'
import apiErrorTypes from '../../constants/apiErrorTypes'
import PUBLIC_MESSAGES from '../../constants/publicMessages'
import joiErrorToApiError from '../joiErrorToApiError'

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
    const { value, error } = schema.validate(req.body, mergedOptions)

    if (!error) {
      req.body = value
      return next()
    }
    const apiError = joiErrorToApiError(error, includeDetails)
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
    const { value, error } = schema.validate(req.params, mergedOptions)

    if (!error) {
      req.params = value
      return next()
    }

    const apiError = new ono({ code: 400, publicMessage: PUBLIC_MESSAGES.INVALID_PARAM }, error.message)

    next(apiError)
  }
}

// validation occurs on req.query
export function validateQuery(schema, options = {}) {
  const defaultOptions = {
    allowUnknown: false
  }

  const mergedOptions = Object.assign(defaultOptions, options)
  return (req, res, next) => {
    const { value, error } = schema.validate(req.query, mergedOptions)

    if (!error) {
      req.query = value
      return next()
    }

    const apiError = new ono({ code: 400, publicMessage: PUBLIC_MESSAGES.INVALID_QUERY }, error.message)

    if (error.name === 'ValidationError') {
      apiError.errorDetails = error.details.map((detail) => { return { message: `Query: ${detail.message}`, key: detail.context.key }})
      apiError.errorType = apiErrorTypes.ValidationError
    }

    next(apiError)
  }
}
