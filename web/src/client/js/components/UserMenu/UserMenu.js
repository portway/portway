import React from 'react'
import { Link } from 'react-router-dom'

import Constants from 'Shared/constants'

import Store from '../../reducers'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import currentUserId from 'Libs/currentUserId'
import { logoutUser } from '../../actions/user'

import DropdownComponent from 'Components/Dropdown/DropdownComponent'

import './UserMenu.scss'

function logoutAction() {
  Store.dispatch(logoutUser(currentUserId))
}

const UserMenu = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())

  // fuck outta here
  if (!currentUser) return null

  const name = `${currentUser.firstName} ${currentUser.lastName}`
  const button = {
    className: 'btn--blank user-menu__button',
    label: `${name}'s avatar`
  }
  return (
    <DropdownComponent className="user-menu__dropdown" button={button}>
      <li className="menu__item">
        <Link to={Constants.PATH_SETTINGS} className="btn btn--blank">Settings</Link>
      </li>
      <li className="menu__divider">
        <button className="btn btn--blank" onClick={logoutAction}>Sign out</button>
      </li>
    </DropdownComponent>
  )
}

export default UserMenu
