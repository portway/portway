import React from 'react'
import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES, SUPPORT_EMAIL } from 'Shared/constants'

const resourceStrings = {
  [NOTIFICATION_RESOURCE.PROJECTS]: 'projects',
  [NOTIFICATION_RESOURCE.PROJECT]: 'this project',
  [NOTIFICATION_RESOURCE.DOCUMENTS]: "this project's documents",
  [NOTIFICATION_RESOURCE.DOCUMENT]: 'this document'
}

export const getNotificationTitle = function(notification) {
  if (notification.type === NOTIFICATION_TYPES.ERROR) {
    switch (notification.code) {
      case 402:
        return 'Payment error'
      case 403:
        return 'Access denied'
      case 404:
        return 'Not found...'
      case 408:
        return 'Request timed out'
      case 413:
        return 'File too large'
      case 415:
        return 'Unsupported media type'
      case 429:
        return 'Too many requests'
      case 500:
        return 'Internal error...'
      default:
        return 'Unknown error...'
    }
  }
  return null
}

export const getNotificationMessage = function(notification) {
  const errorMessage = resourceStrings[notification.resource]
  const errorMessages = {
    403: `Sorry, you don\'t have access to ${errorMessage || 'that'}`,
    404: errorMessage ? `Sorry, we couldn\'t find ${errorMessage}` : '',
    429: (
      <>
        {`There's a lot of bandwidth being used by your org right now, please refresh in a few minutes.`}
      </>
    ),
    500: (
      <>
        {`Something went wrong, and it\'s our fault. Try refreshing, or email`}{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </>
    )
  }
  if (notification.type === NOTIFICATION_TYPES.ERROR) {
    return errorMessages[notification.code]
  }
  // Return the default message if it's not an error
  return notification.message
}
