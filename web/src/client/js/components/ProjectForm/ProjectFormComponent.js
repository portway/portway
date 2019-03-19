import React from 'react'
import PropTypes from 'prop-types'
import DropdownSelectComponent from 'Components/DropdownSelect/DropdownSelectComponent'

const ProjectFormComponent = ({ formOptions, teamOptions }) => {
  return (
    <form className="project-form" onSubmit={formOptions.submitHandler}>
      <div className="form-field">
        <label htmlFor="projectName">Project Name</label>
        <input
          type="text"
          name="project[name]"
          id="projectName"
          placeholder="My new project"
          value={formOptions.values.projectName}
          onChange={formOptions.changeHandler}
        />
      </div>
      <div className="form-field form-field--large">
        <label htmlFor="projectDescription">Description (optional)</label>
        <input
          type="text"
          name="project[description]"
          id="projectDescription"
          value={formOptions.values.projectDescription}
          onChange={formOptions.changeHandler}
        />
      </div>
      {teamOptions && (
        <div className="form-field">
          <label htmlFor="projectUsers">Team (optional)</label>
          <DropdownSelectComponent
            button={{ className: 'btn--white', label: 'Add team members', icon: 'icon-user' }}
            menu={{
              hasAutoComplete: true,
              isOpen: true,
              multiSelect: true,
              onChange: teamOptions.changeHandler,
              options: teamOptions.users,
              value: teamOptions.selectedUsers
            }}
          />
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
  name: PropTypes.string,
  description: PropTypes.string,
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
    ),
    changeHandler: PropTypes.func
  })
}

export default ProjectFormComponent
