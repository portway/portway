import PUBLIC_MESSAGES from '../../constants/publicMessages'

const getPublicMessage = function(code) {
  switch (code) {
    case 400:
      return PUBLIC_MESSAGES.BAD_REQUEST
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
    code,
    status,
    statusCode,
    expose,
    errorType,
    errorDetails,
    message,
    publicMessage } = error

  const responseCode = code || status || statusCode || 500

  // some middleware will attach an expose Boolean to the error, which is a green-light to pass the error message directly to consumer
  const exposedMessage = expose ? message : null

  const responseMessage = publicMessage || exposedMessage || getPublicMessage(responseCode)

  //TODO handle conditional logging here for different environments
  console.error(error.stack)
  res.status(responseCode).json({
    error: responseMessage,
    errorType,
    errorDetails
  })
}