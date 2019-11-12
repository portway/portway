import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { dismissNotification } from 'Actions/notifications'
import NotificationList from './NotificationList'

const NotificationsContainer = ({ dismissNotification, notifications }) => {
  const notificationArray = Object.keys(notifications).map((key) => {
    return {
      id: key,
      notification: notifications[key]
    }
  })

  function dismissHandler(notificationId) {
    // Delayed so the animation can take place
    setTimeout(() => {
      dismissNotification(notificationId)
    }, 500)
  }

  return (
    <div className="notifications">
      <NotificationList dismissHandler={dismissHandler} notifications={notificationArray} />
    </div>
  )
}

NotificationsContainer.propTypes = {
  dismissNotification: PropTypes.func.isRequired,
  notifications: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications
  }
}

const mapDispatchToProps = { dismissNotification }

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer)
