import PUBLIC_MESSAGES from '../../constants/publicMessages'

const getPublicMessage = function(code) {
  switch (code) {
    case 400:
      return PUBLIC_MESSAGES.VALIDATION_ERROR
    case 404:
      return PUBLIC_MESSAGES.NOT_FOUND
    case 500:
    default:
      return PUBLIC_MESSAGES.SERVER_ERROR
  }
}

export default function(error, req, res, next) {
  const { code = 500, errorType, errorDetails, publicMessage } = error
  //TODO handle conditional logging here for different environments
  console.error(error.stack)
  res.status(code).json({
    error: publicMessage || getPublicMessage(code),
    errorType,
    errorDetails
  })
}