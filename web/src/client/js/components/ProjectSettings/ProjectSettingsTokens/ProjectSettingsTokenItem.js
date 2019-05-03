import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import ClipboardComponent from 'Components/Clipboard/ClipboardComponent'

const ProjectSettingsTokenItem = ({ selected, selectHandler, token }) => {
  const tokenRef = useRef()
  return (
    <li key={`token-${token.id}`} className={`project-settings__token-list-item${selected ? ' project-settings__token-list-item--selected' : '' }`}>
      <input type="radio" name="project-token" defaultChecked={selected} onClick={() => { selectHandler(token.id) }} />
      <div className="project-settings__token-list-item__info">
        <div className="project-settings__token-list-item__details">
          <span className="project-settings__token-list-item__name">{token.name}</span>
        </div>
        <div className="project-settings__token-list-item__token">
          <div className="project-settings__token-list-item__field">
            <label htmlFor={`token-${token.id}`} className="pill">{Constants.PROJECT_ROLE_NAMES[token.roleId]}</label>
            <input readOnly type="text" value={token.token} ref={tokenRef} id={`token-${token.id}`} />
          </div>
          <ClipboardComponent copyRef={tokenRef} />
        </div>
      </div>
    </li>
  )
}

ProjectSettingsTokenItem.propTypes = {
  selected: PropTypes.bool,
  selectHandler: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired
}

export default ProjectSettingsTokenItem
