import PUBLIC_MESSAGES from '../../constants/publicMessages'
import multer from 'multer'
import logger from '../../integrators/logger'
import { LOG_LEVELS } from '../../constants/logging'

const getPublicMessage = function(code) {
  switch (code) {
    case 400:
      return PUBLIC_MESSAGES.BAD_REQUEST
    case 401:
      return PUBLIC_MESSAGES.UNAUTHORIZED
    case 402:
      return PUBLIC_MESSAGES.INVALID_PAYMENT
    case 404:
      return PUBLIC_MESSAGES.NOT_FOUND
    case 500:
    default:
      return PUBLIC_MESSAGES.SERVER_ERROR
  }
}

// This final piece of middleware handles any errors passed through the middleware chain
// these could have one of a few different formats
// for instance, bodyParser errors will look like:
// { status: 400, statusCode: 400, expose: true, message: 'Unexpected token \n in JSON at position 9' }
// while our own errors will look like:
// { code: 404, publicMessage: 'Not Found', message: 'Some internal message not for public consumption' }
// and some potentially unhandled internal errors could just be:
// { message: 'Some internal error' }

export default function(error, req, res, next) {
  const {
    status,
    statusCode,
    expose,
    errorType,
    errorDetails = [],
    message } = error

  let { code, publicMessage } = error

  // multer errors pass a string on the code field rather than a status code, grab these and force a 400
  // TODO: expand this to have specific file error messages for different multer codes
  if (error instanceof multer.MulterError) {
    publicMessage = 'File error'
    const fileMessage = code === 'LIMIT_FILE_SIZE' ? 'File too large' : 'Invalid file'
    code = code === 'LIMIT_FILE_SIZE' ? 413 : 415
    errorDetails.push({
      message: fileMessage,
      key: 'file'
    })
  }

  const responseCode = code || status || statusCode || 500

  // some middleware will attach an expose Boolean to the error, which is a green-light to pass the error message directly to consumer
  const exposedMessage = expose ? message : null

  const responseMessage = publicMessage || exposedMessage || getPublicMessage(responseCode)

  // Match any 5XX error code and log at error level
  const level = responseCode > 499 ? LOG_LEVELS.ERROR : LOG_LEVELS.WARNING

  logger(level, { error })

  res.status(responseCode).json({
    error: responseMessage,
    errorType,
    errorDetails
  })
}