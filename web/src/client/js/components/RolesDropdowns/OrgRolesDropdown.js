import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ORGANIZATION_ROLE_NAMES, ORGANIZATION_ROLE_IDS } from 'Shared/constants'
import { CaretIcon } from 'Components/Icons'
import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'

const OrgRolesDropdown = ({ align, buttonStyle, defaultValue, disabled, name, onChange }) => {
  const [permissionMenuLabel, setPermissionMenuLabel] = useState(ORGANIZATION_ROLE_NAMES[defaultValue])
  const roleSelectorButton = {
    label: permissionMenuLabel,
    className: `${buttonStyle === 'normal' ? 'btn--white' : 'btn--blank'} btn--with-icon`,
    icon: <CaretIcon />,
    name: name
  }
  const adjustRoleHandler = (roleId) => {
    setPermissionMenuLabel(ORGANIZATION_ROLE_NAMES[roleId])
    onChange(roleId)
  }
  return (
    <DropdownComponent align={align} autoCollapse={true} button={roleSelectorButton} className="project-roles" disabled={disabled}>
      <DropdownItem label={ORGANIZATION_ROLE_NAMES[ORGANIZATION_ROLE_IDS.USER]} onClick={() => adjustRoleHandler(ORGANIZATION_ROLE_IDS.USER) } />
      <DropdownItem label={ORGANIZATION_ROLE_NAMES[ORGANIZATION_ROLE_IDS.ADMIN]} onClick={() => adjustRoleHandler(ORGANIZATION_ROLE_IDS.ADMIN) } />
    </DropdownComponent>
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
