import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import ProjectForm from './ProjectFormComponent'
import Constants from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'

const ProjectCreatorContainer = ({ history }) => {
  // Options for the Project Form
  const formOptions = {
    cancelHandler: cancelHandler, // Optional
    cancelLabel: 'Cancel', // Optional
    submitHandler: submitHandler,
    submitLabel: 'Create Project'
  }
  function submitHandler() {
    console.info('Submitted')
  }
  function cancelHandler() {
    history.push({ pathname: Constants.PATH_PROJECTS })
  }

  // Selected users are team members on this project and only exposed
  // if the user has permission to add team members
  const [selectedUsers, setSelectedUsers] = useState([])
  function teamMemberHandler(option) {
    setSelectedUsers(option)
  }
  // Options for the Team which is completely optional
  // Though all properties are required.
  const { data: users } = useDataService(dataMapper.users.list())

  const userOptions = Object.values(users).map((user) => {
    return {
      value: String(user.id),
      label: `${user.firstName} ${user.lastName}`
    }
  })

  const teamOptions = {
    users: userOptions,
    selectedUsers: selectedUsers,
    changeHandler: teamMemberHandler
  }

  return (
    <div>
      <ProjectForm formOptions={formOptions} teamOptions={teamOptions} />
    </div>
  )
}

ProjectCreatorContainer.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(ProjectCreatorContainer)
