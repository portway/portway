import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PATH_ADMIN } from 'Shared/constants'
import AdminDashboardContainer from 'Components/Admin/AdminDashboardContainer'

const AdminSection = () => {
  const adminSectionPath = `${PATH_ADMIN}/:section`
  const adminSectionWithParamPath = `${PATH_ADMIN}/:section/:subSection`
  return (
    <Switch>
      <Route exact path={adminSectionWithParamPath} component={AdminDashboardContainer} />
      <Route exact path={adminSectionPath} component={AdminDashboardContainer} />
      <Route exact path={PATH_ADMIN} component={AdminDashboardContainer} />
    </Switch>
  )
}

export default AdminSection
