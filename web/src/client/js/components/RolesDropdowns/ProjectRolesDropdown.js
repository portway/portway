import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'

import { PROJECT_ROLE_IDS, PROJECT_ROLE_NAMES } from 'Shared/constants'
import { CaretIcon } from 'Components/Icons'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuItem } from 'Components/Menu/Menu'

const ProjectRolesDropdown = ({ align, defaultValue, disabled, onChange }) => {
  const [permissionMenuLabel, setPermissionMenuLabel] = useState(PROJECT_ROLE_NAMES[defaultValue])
  const [expanded, setExpanded] = useState(false)
  const anchorRef = useRef()
  const containerRef = useRef()

  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])

  useClickOutside(containerRef, collapseCallback)
  useBlur(containerRef, collapseCallback)

  const adjustRoleHandler = (roleId) => {
    setPermissionMenuLabel(PROJECT_ROLE_NAMES[roleId])
    onChange(roleId)
  }

  const buttonStyleOverride = {
    display: 'block',
    padding: '1rem 1.4rem',
    whiteSpace: 'normal',
  }

  return (
    <PopperGroup anchorRef={containerRef}>
      <button
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="project-role-dropdown"
        className="btn btn--white btn--with-icon"
        disabled={disabled}
        onClick={() => setExpanded(!expanded)}
        ref={anchorRef}
      >
        <span className="label">{permissionMenuLabel}</span>
        <CaretIcon />
      </button>
      <Popper id="project-role-dropdown" anchorRef={anchorRef} align={align} autoCollapse={collapseCallback} open={!expanded} width="300">
        <Menu>
          <MenuItem>
            <button
              className="btn btn--blank"
              onClick={() => adjustRoleHandler(PROJECT_ROLE_IDS.READER) }
              style={buttonStyleOverride}
            >
              {PROJECT_ROLE_NAMES[PROJECT_ROLE_IDS.READER]}
              <p className="small">
                Project Readers can view all of the documents in this project, but that is all.
              </p>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="btn btn--blank"
              onClick={() => adjustRoleHandler(PROJECT_ROLE_IDS.CONTRIBUTOR) }
              style={buttonStyleOverride}
            >
              {PROJECT_ROLE_NAMES[PROJECT_ROLE_IDS.CONTRIBUTOR]}
              <p className="small">
                Project Contributors can create, edit, publish, and delete documents within this
                project. They can also view API data.
              </p>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="btn btn--blank"
              onClick={() => adjustRoleHandler(PROJECT_ROLE_IDS.ADMIN) }
              style={buttonStyleOverride}
            >
              {PROJECT_ROLE_NAMES[PROJECT_ROLE_IDS.ADMIN]}
              <p className="small">
                Project Contributors can create, edit, publish, and delete documents within this
                project. They can also view API data.
              </p>
            </button>
          </MenuItem>
        </Menu>
      </Popper>
    </PopperGroup>
  )
}

ProjectRolesDropdown.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  defaultValue: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

ProjectRolesDropdown.defaultProps = {
  align: 'left',
  buttonStyle: 'normal',
  projectRoleId: PROJECT_ROLE_IDS.READER
}

export default ProjectRolesDropdown
