import React from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import TextField from 'Components/Form/TextField'
import DropdownSelectComponent from 'Components/DropdownSelect/DropdownSelectComponent'

const ProjectFormComponent = ({ errors, formOptions, teamOptions }) => {
  return (
    <form className="project-form" onSubmit={formOptions.submitHandler}>
      <TextField
        id="projectName"
        label="Project Name"
        name="name"
        errors={errors.name}
        placeholder="My new project"
        value={formOptions.values.projectName}
        onChange={formOptions.changeHandler} />
      <TextField
        id="projectDescription"
        label="Description (optional)"
        large
        name="description"
        errors={errors.description}
        value={formOptions.values.projectDescription}
        onChange={formOptions.changeHandler} />
      {teamOptions && (
        <div className="form-field">
          <label htmlFor="projectUsers">Team (optional)</label>
          <DropdownSelectComponent
            button={{
              className: 'btn--white',
              label: 'Add team members',
              icon: <UserIcon width="20" height="20" />
            }}
            menu={{
              hasAutoComplete: true,
              isOpen: true,
              multiSelect: true,
              onChange: teamOptions.changeHandler,
              options: teamOptions.users,
              value: teamOptions.selectedUsers
            }} />
        </div>
      )}
      <div className="btn-group">
        <input type="submit" className="btn" value={formOptions.submitLabel} />
        {formOptions.cancelHandler && (
          <button className="btn btn--blank" onClick={formOptions.cancelHandler}>
            {formOptions.cancelLabel || 'Cancel'}
          </button>
        )}
      </div>
    </form>
  )
}

ProjectFormComponent.propTypes = {
  errors: PropTypes.object,
  formOptions: PropTypes.shape({
    submitLabel: PropTypes.string.isRequired,
    submitHandler: PropTypes.func.isRequired,
    cancelLabel: PropTypes.string,
    cancelHandler: PropTypes.func
  }),
  teamOptions: PropTypes.shape({
    users: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
      })
    ),
    selectedUsers: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
      })
    )
  })
}

export default ProjectFormComponent
