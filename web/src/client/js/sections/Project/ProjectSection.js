import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PATH_DOCUMENT, PATH_PROJECT, PATH_PROJECT_CREATE } from 'Shared/constants'

import Project from './Project'
import ProjectCreate from './ProjectCreate'
import ProjectSettings from './ProjectSettings'

import './_ProjectSection.scss'

const ProjectSection = () => {
  const projectBasePath = `${PATH_PROJECT}/:projectId`
  const documentPath = `${PATH_PROJECT}/:projectId${PATH_DOCUMENT}/:documentId`
  const settingsPath = `${PATH_PROJECT}/:projectId/settings`
  const settingsSectionPath = `${PATH_PROJECT}/:projectId/settings/:setting`
  const createPath = PATH_PROJECT_CREATE

  return (
    <Switch>
      <Route exact path={settingsPath} component={ProjectSettings} />
      <Route exact path={settingsSectionPath} component={ProjectSettings} />
      <Route exact path={createPath} component={ProjectCreate} />
      <Route path={documentPath} component={Project} />
      <Route path={projectBasePath} component={Project} />
    </Switch>
  )
}

export default ProjectSection
