import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PATH_ADMIN } from 'Shared/constants'
import AdminDashboardContainer from 'Components/AdminDashboard/AdminDashboardContainer'

const AdminSection = () => {
  const adminSectionPath = `${PATH_ADMIN}/:section`
  console.log('I am called')
  return (
    <Switch>
      <Route exact path={adminSectionPath} component={AdminDashboardContainer} />
      <Route exact path={PATH_ADMIN} component={AdminDashboardContainer} />
    </Switch>
  )
}

export default AdminSection
