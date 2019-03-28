import React from 'react'
import { Link } from 'react-router-dom'

import Constants from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'

import './UserMenu.scss'

const UserMenu = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())
  const name = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''
  const button = {
    className: 'btn--blank user-menu__button',
    label: `${name}'s avatar`
  }
  return (
    <DropdownComponent className="user-menu__dropdown" button={button}>
      <li className="menu__item">
        <Link to={Constants.PATH_SETTINGS} className="btn btn--blank">Settings</Link>
      </li>
      <li className="menu__divider"><Link to={Constants.PATH_LOGOUT}>Sign out</Link></li>
    </DropdownComponent>
  )
}

export default UserMenu
