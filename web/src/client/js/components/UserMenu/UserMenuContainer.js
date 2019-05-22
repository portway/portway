import React from 'react'

import Constants from 'Shared/constants'

import Store from '../../reducers'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'
import { logoutUser } from '../../actions/user'

import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'

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
      </DropdownItem>
      <DropdownItem label="Settings" type="link" href={Constants.PATH_SETTINGS} />
      <DropdownItem label="Sign out" type="button" divider onClick={() => { logoutAction() }} />
    </DropdownComponent>
  )
}

export default UserMenuContainer
