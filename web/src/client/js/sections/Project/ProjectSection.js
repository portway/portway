import React, { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

import { PATH_DOCUMENT, PATH_PROJECT, PATH_PROJECT_CREATE } from 'Shared/constants'

const Project = lazy(() => import(/* webpackChunkName: 'Project' */ './Project'))
const ProjectCreate = lazy(() => import(/* webpackChunkName: 'ProjectCreate' */ './ProjectCreate'))
const ProjectSettings = lazy(() => import(/* webpackChunkName: 'ProjectSettings' */ './ProjectSettings'))

import './_ProjectSection.scss'

const ProjectSection = () => {
  const projectBasePath = `${PATH_PROJECT}/:projectId`
  const documentPath = `${PATH_PROJECT}/:projectId${PATH_DOCUMENT}/:documentId`
  const settingsPath = `${PATH_PROJECT}/:projectId/settings`
  const settingsSectionPath = `${PATH_PROJECT}/:projectId/settings/:setting`
  const settingsWithIdPath = `${PATH_PROJECT}/:projectId/settings/:setting/:settingId`
  const createPath = PATH_PROJECT_CREATE

  return (
    <Switch>
      <Route exact path={settingsPath} component={ProjectSettings} />
      <Route exact path={settingsSectionPath} component={ProjectSettings} />
      <Route exact path={settingsWithIdPath} component={ProjectSettings} />
      <Route exact path={createPath} component={ProjectCreate} />
      <Route path={documentPath} component={Project} />
      <Route path={projectBasePath} component={Project} />
    </Switch>
  )
}

export default ProjectSection
