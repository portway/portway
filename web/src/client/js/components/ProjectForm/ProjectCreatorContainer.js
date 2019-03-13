import React from 'react'

import ProjectForm from './ProjectFormComponent'

function submitHandler() {
  console.info('Submitted')
}

function cancelHandler() {
  console.info('Canceled')
}

const ProjectCreatorContainer = () => {
  const formOptions = {
    submitHandler: submitHandler,
    cancelHandler: cancelHandler,
    submitLabel: 'Create Project',
    cancelLabel: 'Cancel'
  }
  return (
    <div>
      <ProjectForm options={formOptions} />
    </div>
  )
}

export default ProjectCreatorContainer
