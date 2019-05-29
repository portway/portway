import React from 'react'
import PropTypes from 'prop-types'

const ProjectUsersCollapsedItem = ({ color, user }) => {
  const firstInitial = user.name.charAt(0).toUpperCase()
  const itemStyle = {
    backgroundColor: color
  }
  return (
    <li className="project-users__collapsed-item" style={itemStyle} title={user.name}>
      {firstInitial}
    </li>
  )
}

ProjectUsersCollapsedItem.propTypes = {
  color: PropTypes.string,
  user: PropTypes.object.isRequired
}

export default ProjectUsersCollapsedItem
