import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'

import { ORGANIZATION_ROLE_NAMES, ORGANIZATION_ROLE_IDS } from 'Shared/constants'
import { CaretIcon } from 'Components/Icons'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuItem } from 'Components/Menu'

const OrgRolesDropdown = ({ align, buttonStyle, defaultValue, disabled, name, onChange }) => {
  const [permissionMenuLabel, setPermissionMenuLabel] = useState(ORGANIZATION_ROLE_NAMES[defaultValue])
  const [expanded, setExpanded] = useState(false)
  const anchorRef = useRef()
  const containerRef = useRef()

  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])

  useClickOutside(containerRef, collapseCallback)
  useBlur(containerRef, collapseCallback)

  const adjustRoleHandler = (roleId) => {
    setPermissionMenuLabel(ORGANIZATION_ROLE_NAMES[roleId])
    onChange(roleId)
  }
  return (
    <PopperGroup anchorRef={containerRef}>
      <button
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="org-roles-dropdown"
        className="btn btn--white btn--with-icon"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="label">{permissionMenuLabel}</span>
        <CaretIcon />
      </button>
      <Popper id="org-roles-dropdown" anchorRef={anchorRef} autoCollapse={collapseCallback} open={expanded} width="300">
        <Menu>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => adjustRoleHandler(ORGANIZATION_ROLE_IDS.USER) }>
              {ORGANIZATION_ROLE_NAMES[ORGANIZATION_ROLE_IDS.USER]}
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => adjustRoleHandler(ORGANIZATION_ROLE_IDS.ADMIN) }>
              {ORGANIZATION_ROLE_NAMES[ORGANIZATION_ROLE_IDS.ADMIN]}
            </button>
          </MenuItem>
        </Menu>
      </Popper>
    </PopperGroup>
  )
}

OrgRolesDropdown.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  buttonStyle: PropTypes.oneOf(['normal', 'blank']),
  defaultValue: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

OrgRolesDropdown.defaultProps = {
  align: 'left',
  buttonStyle: 'normal',
  projectRoleId: ORGANIZATION_ROLE_IDS.USER
}

export default OrgRolesDropdown
