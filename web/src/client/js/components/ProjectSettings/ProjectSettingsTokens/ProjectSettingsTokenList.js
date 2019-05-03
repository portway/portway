import React from 'react'
import PropTypes from 'prop-types'

import ProjectSettingsTokenItem from './ProjectSettingsTokenItem'

const ProjectSettingsTokenList = ({ selectedToken, tokens, tokenSelectHandler }) => {
  function renderTokens() {
    return tokens.map((token) => {
      return <ProjectSettingsTokenItem
        key={`token-${token.id}`}
        selected={selectedToken === token.id}
        selectHandler={tokenSelectHandler}
        token={token} />
    })
  }
  if (tokens.length === 0) {
    return <p>There are no project tokens. Have your project admin create one.</p>
  }
  return (
    <ol className="project-settings__token-list">
      {renderTokens()}
    </ol>
  )
}

ProjectSettingsTokenList.propTypes = {
  selectedToken: PropTypes.number,
  tokens: PropTypes.array.isRequired,
  tokenSelectHandler: PropTypes.func.isRequired
}

export default ProjectSettingsTokenList
