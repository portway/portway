import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import { TrashIcon } from 'Components/Icons'
import ClipboardComponent from 'Components/Clipboard/ClipboardComponent'

const ProjectSettingsTokenItem = ({ removeHandler, selected, selectHandler, token }) => {
  const tokenRef = useRef()
  const pillClasses = cx({
    'pill': true,
    'pill--green': selected,
  })
  return (
    <li key={`token-${token.id}`} className={`project-settings__token-list-item${selected ? ' project-settings__token-list-item--selected' : '' }`}>
      <div className="project-settings__token-list-item__info">
        <div className="project-settings__token-list-item__details">
          <span className="project-settings__token-list-item__name">{token.name}</span>
        </div>
        <div className="project-settings__token-list-item__token">
          <div className="project-settings__token-list-item__field">
            <label>
              <input type="radio" name="project-token" defaultChecked={selected} onClick={() => { selectHandler(token.id) }} />
              <span className={pillClasses}>{Constants.PROJECT_ROLE_NAMES[token.roleId]}</span>
            </label>
            <input readOnly type="text" value={token.token} ref={tokenRef} id={`token-${token.id}`} />
          </div>
          <ClipboardComponent copyRef={tokenRef} />
          <button
            aria-label="Remove token"
            className="btn btn--blank btn--with-circular-icon"
            onClick={() => { removeHandler(token.id) }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  )
}

ProjectSettingsTokenItem.propTypes = {
  removeHandler: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  selectHandler: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired
}

export default ProjectSettingsTokenItem
