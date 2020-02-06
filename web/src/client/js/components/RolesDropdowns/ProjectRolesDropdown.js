import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'

import { PROJECT_ROLE_IDS, PROJECT_ROLE_NAMES } from 'Shared/constants'
import { CaretIcon } from 'Components/Icons'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuItem } from 'Components/Menu'

const ProjectRolesDropdown = ({ align, className, defaultValue, disabled, onChange }) => {
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

  const menuButtonStyle = {
    minWidth: '10rem'
  }

  const buttonStyleOverride = {
    display: 'block',
    padding: '1rem 1.4rem',
    whiteSpace: 'normal',
  }

  const roleDescriptionStyle = {
    fontSize: '1.3rem',
    opacity: '0.5',
  }

  return (
    <PopperGroup anchorRef={containerRef} className={className}>
      <button
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="project-role-dropdown"
        className="btn btn--form btn--with-icon"
        disabled={disabled}
        onClick={() => setExpanded(!expanded)}
        ref={anchorRef}
        style={menuButtonStyle}
        type="button"
      >
        <span className="label">{permissionMenuLabel}</span>
        <CaretIcon />
      </button>
      <Popper id="project-role-dropdown" anchorRef={anchorRef} align={align} autoCollapse={collapseCallback} open={expanded} width="300">
        <Menu anchorRef={anchorRef} isActive={expanded}>
          <MenuItem>
            <button
              className="btn btn--blank btn--menu-item"
              onClick={() => adjustRoleHandler(PROJECT_ROLE_IDS.READER) }
              style={buttonStyleOverride}
              ref={React.createRef()}
              type="button"
            >
              {PROJECT_ROLE_NAMES[PROJECT_ROLE_IDS.READER]}
              <p className="small" style={roleDescriptionStyle}>
                Readers can view all of the documents in this project, but that is all.
              </p>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="btn btn--blank btn--menu-item"
              onClick={() => adjustRoleHandler(PROJECT_ROLE_IDS.CONTRIBUTOR) }
              style={buttonStyleOverride}
              ref={React.createRef()}
              type="button"
            >
              {PROJECT_ROLE_NAMES[PROJECT_ROLE_IDS.CONTRIBUTOR]}
              <p className="small" style={roleDescriptionStyle}>
                Contributors can create, edit, publish, and delete documents within this
                project. They can also view API data.
              </p>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="btn btn--blank btn--menu-item"
              onClick={() => adjustRoleHandler(PROJECT_ROLE_IDS.ADMIN) }
              style={buttonStyleOverride}
              ref={React.createRef()}
              type="button"
            >
              {PROJECT_ROLE_NAMES[PROJECT_ROLE_IDS.ADMIN]}
              <p className="small" style={roleDescriptionStyle}>
                Admins can manage the project team, delete the project all together, and
                do everything else a contributor can.
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
  className: PropTypes.string,
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
