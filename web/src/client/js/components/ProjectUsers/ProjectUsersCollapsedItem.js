import React from 'react'
import PropTypes from 'prop-types'

const ProjectUsersCollapsedItem = ({ user }) => {
  const firstInitial = user.name.charAt(0).toUpperCase()
  return (
    <li className="project-users__collapsed-item" title={user.name}>
      {firstInitial}
    </li>
  )
}

ProjectUsersCollapsedItem.propTypes = {
  user: PropTypes.object.isRequired
}

export default ProjectUsersCollapsedItem
