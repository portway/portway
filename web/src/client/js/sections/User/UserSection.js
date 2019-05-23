import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PATH_SETTINGS } from 'Shared/constants'
import UserSettingsContainer from 'Components/User/UserSettingsContainer'

const UserSection = () => {
  const userSectionPath = `${PATH_SETTINGS}/:section`
  return (
    <Switch>
      <Route exact path={userSectionPath} component={UserSettingsContainer} />
      <Route exact path={PATH_SETTINGS} component={UserSettingsContainer} />
    </Switch>
  )
}

export default UserSection
