import React, { useCallback, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import useBlur from 'Hooks/useBlur'
import useClickOutside from 'Hooks/useClickOutside'
import useDataService from 'Hooks/useDataService'

// Context
import ApplicationContext from '../../contexts/ApplicationContext'

import {
  NETWORK_STATUS,
  ORGANIZATION_ROLE_IDS,
  PATH_ADMIN,
  PATH_HELP,
  PATH_SETTINGS
} from 'Shared/constants'

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

  const userMenuButtonClasses = cx({
    'btn': true,
    'btn--blank': true,
    'user-menu__button': true,
    'user-menu__button--with-avatar': currentUser.avatar,
  })

  if (!currentUser || !currentOrg) {
    return (
      <div className="user-menu">
        <div
          className="user-menu__button"
          style={{ backgroundImage: `url(${UserIcon})` }}
        />
      </div>
    )
  }

  return (
    <ApplicationContext.Consumer>
      {({ networkStatus }) => (
        <PopperGroup anchorRef={containerRef} className="user-menu">
          <button
            aria-expanded={expanded}
            aria-haspopup="true"
            aria-controls="user-menu"
            className={userMenuButtonClasses}
            onClick={() => setExpanded(!expanded)}
            ref={anchorRef}
            style={{ backgroundImage: `url(${currentUser.avatar || UserIcon}` }}
          >
            {currentUser.name}’s avatar
          </button>
          {networkStatus === NETWORK_STATUS.OFFLINE &&
          <div
            aria-label="Network offline"
            className="user-menu__network-dot"
            title="Network offline. Please check your internet connection."
          />
          }
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
              {networkStatus === NETWORK_STATUS.OFFLINE &&
              <div className="user-menu__network-status">
                You are not connected to the internet. Changes will not save until you’re back online.
              </div>
              }
            </MenuHeader>
            <Menu anchorRef={anchorRef} isActive={expanded}>
              <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}>
                <MenuItem>
                  <Link className="btn btn--blank" to={PATH_ADMIN} ref={React.createRef()}>
                    Administration
                  </Link>
                </MenuItem>
              </OrgPermission>
              <MenuItem>
                <Link className="btn btn--blank" to={PATH_HELP} ref={React.createRef()}>
                  Help
                </Link>
              </MenuItem>
              <MenuItem>
                <button className="btn btn--blank" onClick={() => { logoutAction() }} ref={React.createRef()}>
                  Sign out
                </button>
              </MenuItem>
            </Menu>
          </Popper>
        </PopperGroup>
      )}
    </ApplicationContext.Consumer>
  )
}


export default UserMenuContainer
