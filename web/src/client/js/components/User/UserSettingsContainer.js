import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import UserSettingsComponent from './UserSettingsComponent'

const UserSettingsContainer = ({ match }) => {
  return <UserSettingsComponent section={match.params.section} />
}

UserSettingsContainer.propTypes = {
  match: PropTypes.object
}

export default withRouter(UserSettingsContainer)
