import React from 'react'
import { Link } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_ADMIN, PATH_SETTINGS } from 'Shared/constants'

import Store from '../../reducers'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'
import { logoutUser } from 'Actions/user'

import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'
import OrgPermission from 'Components/Permission/OrgPermission'

import './UserMenu.scss'

function logoutAction() {
  Store.dispatch(logoutUser(currentUserId))
}

const UserMenuContainer = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())

  // fuck outta here
  if (!currentUser) return null

  const name = `${currentUser.name}`
  const button = {
    className: 'btn--blank user-menu__button',
    label: `${name}'s avatar`
  }
  return (
    <DropdownComponent className="user-menu__dropdown" button={button} align="right">
      <DropdownItem type="banner" className="user-menu__banner">
        <span className="user-menu__username">{name}</span>
        <span className="user-menu__email">{currentUser.email}</span>
        <Link to={PATH_SETTINGS} className="user-menu__link">My settings</Link>
      </DropdownItem>
      <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}>
        <DropdownItem label="Administration" type="link" href={PATH_ADMIN} />
      </OrgPermission>
      <DropdownItem label="Sign out" type="button" divider onClick={() => { logoutAction() }} />
    </DropdownComponent>
  )
}

export default UserMenuContainer
