import ono from 'ono'
import apiErrorTypes from '../constants/apiErrorTypes'
import PUBLIC_MESSAGES from '../constants/publicMessages'

export default function joiErrorToApiError(error, includeDetails = false) {
  const apiError = new ono({ code: 400, publicMessage: PUBLIC_MESSAGES.INVALID_PAYLOAD }, error.message)

  if (error.name === 'ValidationError' && includeDetails) {
    apiError.errorDetails = error.details.map((detail) => { return { message: detail.message, key: detail.context.key } })
    apiError.errorType = apiErrorTypes.ValidationError
  }

  return apiError
}
