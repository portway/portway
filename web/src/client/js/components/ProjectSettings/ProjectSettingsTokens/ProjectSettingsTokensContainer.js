import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { createProjectToken, removeProjectToken } from 'Actions/project'
import { uiCreateTokenMode, uiConfirm } from 'Actions/ui'

import ProjectSettingsTokensComponent from './ProjectSettingsTokensComponent'

const ProjectSettingsTokensContainer = ({
  createProjectToken, creating, match, removeProjectToken, uiConfirm, uiCreateTokenMode
}) => {
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

  function tokenRemoveHandler(tokenId) {
    const message = (
      <span>Deleting this token will prevent access to any application using it. Are you sure?</span>
    )
    const confirmedLabel = `Yes, delete this token`
    const confirmedAction = () => { removeProjectToken(projectId, tokenId) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function setCreateMode(value) {
    uiCreateTokenMode(value)
  }

  return <ProjectSettingsTokensComponent
    createHandler={tokenCreateHandler}
    createMode={creating}
    projectId={projectId}
    removeHandler={tokenRemoveHandler}
    setCreateMode={setCreateMode}
    tokens={tokenArray} />
}

ProjectSettingsTokensContainer.propTypes = {
  createProjectToken: PropTypes.func.isRequired,
  creating: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  removeProjectToken: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  uiCreateTokenMode: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    creating: state.ui.tokens.creating,
  }
}

const mapDispatchToProps = { createProjectToken, removeProjectToken, uiConfirm, uiCreateTokenMode }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectSettingsTokensContainer)
)
