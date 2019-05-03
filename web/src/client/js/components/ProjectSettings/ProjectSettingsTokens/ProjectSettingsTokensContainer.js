import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Store from '../../../reducers'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { createProjectToken } from 'Actions/project'

import ProjectSettingsTokensComponent from './ProjectSettingsTokensComponent'

const ProjectSettingsTokensContainer = ({ match }) => {
  const { projectId } = match.params
  const { data: tokens } = useDataService(dataMapper.projects.tokens(projectId))
  if (!tokens) return null
  const tokenArray = Object.values(tokens).map((token) => {
    return {
      id: token.id,
      name: token.name,
      roleId: token.roleId,
      token: token.token,
    }
  })

  function tokenCreateHandler(projectId, projectRoleId, tokenName) {
    Store.dispatch(createProjectToken(projectId, {
      roleId: projectRoleId,
      name: tokenName
    }))
  }

  return <ProjectSettingsTokensComponent createHandler={tokenCreateHandler} projectId={projectId} tokens={tokenArray} />
}

ProjectSettingsTokensContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectSettingsTokensContainer)
