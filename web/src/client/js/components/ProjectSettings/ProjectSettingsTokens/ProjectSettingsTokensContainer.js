import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { createProjectToken } from 'Actions/project'

import ProjectSettingsTokensComponent from './ProjectSettingsTokensComponent'

const ProjectSettingsTokensContainer = ({ createProjectToken, creating, match }) => {
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
    createProjectToken(projectId, {
      roleId: projectRoleId,
      name: tokenName
    })
  }

  return <ProjectSettingsTokensComponent createHandler={tokenCreateHandler} projectId={projectId} tokens={tokenArray} />
}

ProjectSettingsTokensContainer.propTypes = {
  createProjectToken: PropTypes.func.isRequired,
  creating: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    creating: state.ui.tokens.creating
  }
}

const mapDispatchToProps = { createProjectToken }

export default withRouter(
  connect(mapStateToProps)(ProjectSettingsTokensContainer)
)
