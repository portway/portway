import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import NotificationList from './NotificationList'
import './Notifications.scss'

const NotificationsContainer = ({ notifications }) => {
  return (
    <div className="notifications">
      <NotificationList notifications={notifications} />
    </div>
  )
}

NotificationsContainer.propTypes = {
  notifications: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notices
  }
}

export default connect(mapStateToProps)(NotificationsContainer)
