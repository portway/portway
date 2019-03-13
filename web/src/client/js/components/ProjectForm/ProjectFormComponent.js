import React from 'react'
import PropTypes from 'prop-types'

const ProjectFormComponent = ({ options, name, description, users }) => {
  return (
    <form className="project-form">
      <div className="form-field">
        <label htmlFor="projectName">Project Name</label>
        <input
          type="text"
          name="project[name]"
          id="projectName"
          placeholder="My new project"
          value={name}
        />
      </div>
      <div className="form-field form-field--large">
        <label htmlFor="projectDescription">Description (optional)</label>
        <input
          type="text"
          name="project[description]"
          id="projectDescription"
          value={description}
        />
      </div>
      <div className="form-field">
        <label htmlFor="projectUsers">Team (optional)</label>
        <button
          className="btn btn--white btn--with-icon"
          type="button"
          aria-haspopup
          aria-expanded={false}>
          <span className="icon icon-user" /> Add team members
        </button>
        <div hidden>I am a thing</div>
      </div>
      <div className="btn-group">
        <input
          type="submit"
          className="btn"
          onClick={options.submitHandler}
          value={options.submitLabel}
        />
        {options.cancelHandler && (
          <button className="btn btn--blank" onClick={options.cancelHandler}>
            {options.cancelLabel || 'Cancel'}
          </button>
        )}
      </div>
    </form>
  )
}

ProjectFormComponent.propTypes = {
  options: PropTypes.shape({
    submitLabel: PropTypes.string.isRequired,
    submitHandler: PropTypes.func.isRequired,
    cancelLabel: PropTypes.string,
    cancelHandler: PropTypes.func
  }),
  name: PropTypes.string,
  description: PropTypes.string,
  users: PropTypes.object
}

export default ProjectFormComponent
