import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import { CaretIcon } from 'Components/Icons'
import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'

const ProjectRolesDropdown = ({ defaultValue, disabled, onChange }) => {
  const [permissionMenuLabel, setPermissionMenuLabel] = useState(Constants.ROLE_NAMES[defaultValue])
  const roleSelectorButton = {
    label: permissionMenuLabel,
    className: 'btn--white btn--with-icon',
    icon: <CaretIcon width="14" height="14" />
  }
  const adjustRoleHandler = (roleId) => {
    setPermissionMenuLabel(Constants.ROLE_NAMES[roleId])
    onChange(roleId)
  }
  return (
    <DropdownComponent align="right" autoCollapse={true} button={roleSelectorButton} className="project-settings__teammate-menu" disabled={disabled}>
      <DropdownItem label={Constants.ROLE_NAMES[Constants.ROLE_IDS.READER]} onClick={() => adjustRoleHandler(Constants.ROLE_IDS.READER) }>
        <p className="small">Project Readers can view all of the documents in this project, but that is all.</p>
      </DropdownItem>
      <DropdownItem label={Constants.ROLE_NAMES[Constants.ROLE_IDS.CONTRIBUTOR]} onClick={() => adjustRoleHandler(Constants.ROLE_IDS.CONTRIBUTOR) }>
        <p className="small">Project Contributors can create, edit, publish, and delete documents within this project. They can also view API data.</p>
      </DropdownItem>
      <DropdownItem label={Constants.ROLE_NAMES[Constants.ROLE_IDS.ADMIN]} onClick={() => adjustRoleHandler(Constants.ROLE_IDS.ADMIN) }>
        <p className="small">Project Contributors can create, edit, publish, and delete documents within this project. They can also view API data.</p>
      </DropdownItem>
    </DropdownComponent>
  )
}

ProjectRolesDropdown.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

ProjectRolesDropdown.defaultProps = {
  projectRoleId: 3 // READ is default
}

export default ProjectRolesDropdown
