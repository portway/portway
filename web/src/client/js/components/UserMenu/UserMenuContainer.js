import React, { useCallback, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

import useBlur from 'Hooks/useBlur'
import useClickOutside from 'Hooks/useClickOutside'
import useDataService from 'Hooks/useDataService'

import { ORGANIZATION_ROLE_IDS, PATH_ADMIN, PATH_SETTINGS } from 'Shared/constants'

import Store from '../../reducers'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'
import { logoutUser } from 'Actions/user'

import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuHeader, MenuItem } from 'Components/Menu'
import OrgPermission from 'Components/Permission/OrgPermission'

import './UserMenu.scss'

const UserIcon = require('../../../images/icon/user.svg')

function logoutAction() {
  Store.dispatch(logoutUser(currentUserId))
}

const UserMenuContainer = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef()
  const anchorRef = useRef()

  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])

  useClickOutside(containerRef, collapseCallback)
  useBlur(containerRef, collapseCallback)

  // fuck outta here
  if (!currentUser || !currentOrg) return null

  return (
    <PopperGroup anchorRef={containerRef} className="user-menu">
      <button
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="user-menu"
        className="btn btn--blank user-menu__button"
        onClick={() => setExpanded(!expanded)}
        ref={anchorRef}
        style={{ backgroundImage: `url(${currentUser.avatar || UserIcon}` }}
      >
        {currentUser.name}’s avatar
      </button>
      <Popper
        id="user-menu"
        align="right"
        anchorRef={anchorRef}
        autoCollapse={collapseCallback}
        open={expanded}
        width="200"
      >
        <MenuHeader>
          <h2 className="user-menu__username">{currentUser.name}</h2>
          <h3 className="user-menu__organization">{currentOrg.name}</h3>
          <Link to={PATH_SETTINGS} className="user-menu__link">My settings</Link>
        </MenuHeader>
        <Menu anchorRef={anchorRef}>
          <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}>
            <MenuItem tabIndex="0">
              <Link className="btn btn--blank" to={PATH_ADMIN}>Administration</Link>
            </MenuItem>
          </OrgPermission>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => { logoutAction() }}>Sign out</button>
          </MenuItem>
        </Menu>
      </Popper>
    </PopperGroup>
  )
}

export default UserMenuContainer
