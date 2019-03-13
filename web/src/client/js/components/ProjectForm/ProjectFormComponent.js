import React from 'react'

const ProjectFormComponent = () => {
  return (
    <div className="project-form">
      <div className="form-field">
        <label htmlFor="projectName">Project Name</label>
        <input type="text" name="projectName" id="projectName" placeholder="My new project" />
      </div>
    </div>
  )
}

export default ProjectFormComponent
