import React from 'react'

import ProjectForm from './ProjectFormComponent'

const ProjectCreatorContainer = () => {
  return (
    <div>
      <button className="btn-blank --with-circular-icon">
        <span className="icon icon-add" /> New Project
      </button>
      <div hidden>
        <ProjectForm />
      </div>
    </div>
  )
}

export default ProjectCreatorContainer
