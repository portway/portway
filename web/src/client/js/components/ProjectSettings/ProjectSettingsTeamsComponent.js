import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const ProjectSettingsTeamsComponent = ({ project, users, currentUser, onUpdateHandler }) => {
  if (!project) return null
  const usersWithoutMe = Object.values(users).filter(user => user.id !== currentUser.id)
  const userOptions = usersWithoutMe.map((user) => {
    return {
      value: String(user.id),
      label: `${user.firstName} ${user.lastName}`
    }
  })
  return (
    <form className="project-settings__info">
      <section>
        <h2>Team access</h2>
        <Select options={userOptions} />
      </section>
    </form>
  )
}

ProjectSettingsTeamsComponent.propTypes = {
  currentUser: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  onUpdateHandler: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
}

export default ProjectSettingsTeamsComponent
