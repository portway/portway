import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'

const ProjectSettingsTokenList = ({ tokens }) => {
  console.log(tokens)
  function renderTokens() {
    return tokens.map((token) => {
      return (
        <li key={`token-${token.id}`} className="project-settings__token-list-item">
          <span className="project-settings__token-list-item__name">{token.name}</span>
          <span className="project-settings__token-list-item__role pill pill--highlight">{Constants.PROJECT_ROLE_NAMES[token.roleId]}</span>
          <input className="project-settings__token-list-item__token" readOnly type="text" value={token.token} />
        </li>
      )
    })
  }
  return (
    <ol className="prokect-settings__token-list">
      {renderTokens()}
    </ol>
  )
}

ProjectSettingsTokenList.propTypes = {
  tokens: PropTypes.array.isRequired
}

export default ProjectSettingsTokenList
