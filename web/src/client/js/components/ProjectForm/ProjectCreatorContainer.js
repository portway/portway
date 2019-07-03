import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Store from '../../reducers'
import { createProject } from 'Actions/project'
import ProjectFormComponent from './ProjectFormComponent'
import Constants from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'

const ProjectCreatorContainer = ({ errors, history }) => {
  const { data: users } = useDataService(dataMapper.users.list(1))
  const { data: currentUser } = useDataService(dataMapper.users.current())

  const [formValues, setFormValues] = useState({
    projectName: '',
    projectDescription: ''
  })

  function submitHandler(e) {
    e.preventDefault()
    Store.dispatch(
      createProject(
        {
          name: formValues.projectName,
          description: formValues.projectDescription
        },
        history
      )
    )
  }

  function formChangeHandler(e) {
    e.preventDefault()
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  function cancelHandler() {
    history.push({ pathname: Constants.PATH_PROJECTS })
  }

  // Options for the Project Form
  const formOptions = {
    cancelHandler: cancelHandler, // Optional
    cancelLabel: 'Cancel', // Optional
    submitHandler: submitHandler,
    changeHandler: formChangeHandler,
    submitLabel: 'Create Project',
    values: formValues
  }

  // Selected users are team members on this project and only exposed
  // if the user has permission to add team members
  const [selectedUsers, setSelectedUsers] = useState([])
  function teamMemberHandler(option) {
    setSelectedUsers(option)
  }
  // Options for the Team which is completely optional
  // Though all properties are required.
  const usersWithoutMe = Object.values(users).filter(user => user.id !== currentUserId)
  const userOptions = usersWithoutMe.map((user) => {
    return {
      value: String(user.id),
      label: user.name
    }
  })

  const teamOptions = {
    users: userOptions,
    selectedUsers: selectedUsers,
    changeHandler: teamMemberHandler
  }

  return (
    <div>
      <ProjectFormComponent
        errors={errors}
        formOptions={formOptions}
        teamOptions={teamOptions}
        currentUser={currentUser} />
    </div>
  )
}

ProjectCreatorContainer.propTypes = {
  errors: PropTypes.object,
  history: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.project
  }
}

export default withRouter(
  connect(mapStateToProps)(ProjectCreatorContainer)
)
