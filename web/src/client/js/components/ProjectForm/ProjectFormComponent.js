import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'Components/Form/TextField'

const ProjectFormComponent = ({ errors, formOptions }) => {
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
      <div className="btn-group">
        <input type="submit" className="btn" disabled={formOptions.values.projectName === ''} value={formOptions.submitLabel} />
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
  })
}

export default ProjectFormComponent
