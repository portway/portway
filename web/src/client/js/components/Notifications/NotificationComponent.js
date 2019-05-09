import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { NOTIFICATION_TYPES } from 'Shared/constants'
import { RemoveIcon } from 'Components/Icons'
import { getNotificationTitle, getNotificationMessage } from './NotificationMessages'

const NotificationComponent = ({ dismissHandler, id, notification }) => {
  console.log(notification)
  const notificationClasses = cx({
    'notifications__notification': true,
    'notifications__notification--error': notification.type === NOTIFICATION_TYPES.ERROR,
    'notifications__notification--success': notification.type === NOTIFICATION_TYPES.SUCCESS,
    'notifications__notification--warning': notification.type === NOTIFICATION_TYPES.WARNING
  })
  const notificationRef = useRef()
  const title = `${id}-title`
  const desc = `${id}-desc`
  const notificationTitle = getNotificationTitle(notification)
  const notificationMessage = getNotificationMessage(notification)
  function dismissNotification() {
    notificationRef.current.classList.add('notifications__notification--dismissed')
    dismissHandler(id)
  }
  return (
    <li ref={notificationRef} className={notificationClasses} role="alertdialog" aria-labelledby={title} aria-describedby={desc}>
      <button className="btn btn--blank btn--with-circular-icon notifications__remove" onClick={dismissNotification}>
        <RemoveIcon />
      </button>
      <div className="notifications__content">
        <h2 id={title} className="notifications__title">{notificationTitle}</h2>
        <p id={desc} className="notifications__message">{notificationMessage}</p>
        {notification.code && notification.type === NOTIFICATION_TYPES.ERROR &&
        <span className="notifications__code note">Error code: {notification.code}</span>
        }
      </div>
    </li>
  )
}

NotificationComponent.propTypes = {
  dismissHandler: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  notification: PropTypes.shape({
    code: PropTypes.number,
    resource: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })
}

export default NotificationComponent
