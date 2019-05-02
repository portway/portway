import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'

const ProjectSettingsTokenItem = ({ copied, copyHandler, selected, selectHandler, token }) => {
  const tokenRef = useRef()
  function copyTokenToClipboard() {
    if (tokenRef && tokenRef.current) {
      tokenRef.current.select()
      document.execCommand('copy')
      tokenRef.current.blur()
      copyHandler(token.id)
    }
  }
  return (
    <li key={`token-${token.id}`} className={`project-settings__token-list-item${selected ? ' project-settings__token-list-item--selected' : '' }`}>
      <input type="radio" name="project-token" defaultChecked={selected} onClick={() => { selectHandler(token.id) }} />
      <div className="project-settings__token-list-item__info">
        <div className="project-settings__token-list-item__details">
          <span className="project-settings__token-list-item__name">{token.name}</span>
          <span className="project-settings__token-list-item__role pill pill--highlight">{Constants.PROJECT_ROLE_NAMES[token.roleId]}</span>
        </div>
        <div className="project-settings__token-list-item__token">
          <input readOnly type="text" value={token.token} ref={tokenRef} />
          <button className="btn btn--blank btn--with-icon" onClick={copyTokenToClipboard}>
            {copied && <span>Copied</span>}
            {!copied && <span>Copy</span>}
          </button>
        </div>
      </div>
    </li>
  )
}

ProjectSettingsTokenItem.propTypes = {
  copied: PropTypes.bool,
  copyHandler: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  selectHandler: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired
}

export default ProjectSettingsTokenItem
