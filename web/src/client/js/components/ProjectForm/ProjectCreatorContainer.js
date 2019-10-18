import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Store from '../../reducers'
import { createProject } from 'Actions/project'
import ProjectFormComponent from './ProjectFormComponent'
import Constants from 'Shared/constants'

const ProjectCreatorContainer = ({ errors, history }) => {
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

  return (
    <div>
      <ProjectFormComponent errors={errors} formOptions={formOptions} />
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
