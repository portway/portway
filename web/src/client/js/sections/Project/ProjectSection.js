import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Constants from 'Shared/constants'

import Project from './Project'
import ProjectCreate from './ProjectCreate'
import ProjectSettings from './ProjectSettings'

import './ProjectSection.scss'

const ProjectSection = () => {
  const projectBasePath = `${Constants.PATH_PROJECT}/:projectId`
  const documentPath = `${Constants.PATH_PROJECT}/:projectId${Constants.PATH_DOCUMENT}/:documentId`
  const settingsPath = `${Constants.PATH_PROJECT}/:projectId/settings`
  const createPath = Constants.PATH_PROJECT_CREATE

  return (
    <Switch>
      <Route path={settingsPath} component={ProjectSettings} />
      <Route path={createPath} component={ProjectCreate} />
      <Route path={documentPath} component={Project} />
      <Route path={projectBasePath} component={Project} />
    </Switch>
  )
}

export default ProjectSection
