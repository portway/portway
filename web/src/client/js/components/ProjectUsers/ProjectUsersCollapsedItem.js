import React from 'react'
import PropTypes from 'prop-types'

const ProjectUsersCollapsedItem = ({ color, user }) => {
  const firstInitial = user.name.charAt(0).toUpperCase()
  const itemStyle = {
    backgroundImage: user.avatar ? `url('${user.avatar}')` : 'none',
    backgroundColor: color
  }
  return (
    <li className="project-users__collapsed-item" style={itemStyle} title={user.name}>
      {!user.avatar && firstInitial}
    </li>
  )
}

ProjectUsersCollapsedItem.propTypes = {
  color: PropTypes.string,
  user: PropTypes.object.isRequired
}

ProjectUsersCollapsedItem.defaultProps = {
  color: '#a0a2a1'
}

export default ProjectUsersCollapsedItem
