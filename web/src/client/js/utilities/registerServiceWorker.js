import React from 'react'

import { createNotification } from 'Actions/notifications'
import { NOTIFICATION_TYPES } from 'Shared/constants'

import Store from '../reducers'

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js'
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.info('An update to Portway is available. Refresh for the latest updates!')
                  const message = (
                    <>
                      🚚 An update to Portway has been delivered. <a href={location.href}>Refresh for the latest updates!</a>
                    </>
                  )
                  Store.dispatch(createNotification(message, NOTIFICATION_TYPES.SUCCESS))
                } else {
                  console.info('Content is cached for offline use.')
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error)
        })
    })
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister()
    })
  }
}
