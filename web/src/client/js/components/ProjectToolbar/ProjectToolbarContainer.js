import React from 'react'
import { useParams } from 'react-router-dom'

import ProjectToolbarComponent from './ProjectToolbarComponent'

const ProjectToolbarContainer = () => {
  const { projectId } = useParams()

  return (
    <ProjectToolbarComponent projectId={projectId} />
  )
}


export default ProjectToolbarContainer
