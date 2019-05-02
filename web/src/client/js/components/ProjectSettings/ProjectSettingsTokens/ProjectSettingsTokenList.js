import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ProjectSettingsTokenItem from './ProjectSettingsTokenItem'

const ProjectSettingsTokenList = ({ selectedToken, tokens, tokenSelectHandler }) => {
  const [copiedToken, setCopiedToken] = useState(null)
  function copyHandler(tokenId) {
    setCopiedToken(tokenId)
  }
  function renderTokens() {
    return tokens.map((token) => {
      return <ProjectSettingsTokenItem
        key={`token-${token.id}`}
        copied={copiedToken === token.id}
        copyHandler={copyHandler}
        selected={selectedToken === token.id}
        selectHandler={tokenSelectHandler}
        token={token} />
    })
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
