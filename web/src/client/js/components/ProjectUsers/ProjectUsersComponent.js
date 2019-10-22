import React from 'react'
import PropTypes from 'prop-types'

import ProjectUsersCollapsedItem from './ProjectUsersCollapsedItem'

import './_ProjectUsers.scss'

const ProjectUsersComponent = ({ collapsed, users }) => {
  const userColors = [
    'var(--color-green-light)',
    'var(--color-green)',
    'var(--color-green-dark)',
    'var(--color-cyan)',
    'var(--color-cyan-dark)',
    'var(--color-yellow)',
    'var(--color-yellow-dark)',
    'var(--color-red)',
    'var(--color-red-dark)',
    'var(--color-blue)',
    'var(--color-blue-dark)',
    'var(--color-purple)',
    'var(--color-purple-dark)',
    'var(--color-orange)',
    'var(--color-orange-dark)',
  ]
  const collapsedUsers = users.slice(0, 2)
  const collapsedDiff = users.length - collapsedUsers.length
  const usedColors = []

  function getUserColor() {
    const max = userColors.length - 1
    const color = userColors[Math.floor(Math.random() * Math.floor(max))]
    usedColors.includes(color) ? getUserColor() : usedColors.push(color)
    return color
  }

  // Show 3 users at first
  function renderCollapsedUsers() {
    return collapsedUsers.map((user, index) => {
      return <ProjectUsersCollapsedItem color={getUserColor()} user={user} key={`${user.id}-${index}`} />
    })
  }

  return (
    <div className="project-users">
      {collapsed &&
      <ul className="project-users__collapsed-list">
        {renderCollapsedUsers()}
        {collapsedDiff > 0 &&
        <li className="project-users__collapsed-item" title={`${collapsedDiff} more...`}>...</li>
        }
      </ul>
      }
    </div>
  )
}

ProjectUsersComponent.propTypes = {
  collapsed: PropTypes.bool,
  users: PropTypes.array,
}

ProjectUsersComponent.defaultProps = {
  users: []
}

export default ProjectUsersComponent
