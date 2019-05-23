import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS } from 'Shared/constants'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminDashboardComponent from './AdminDashboardComponent'

const AdminDashboardContainer = ({ match }) => {
  return (
    <OrgPermission
      acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
      elseRender={(<Redirect to={PATH_PROJECTS} />)}>
      <AdminDashboardComponent section={match.params.section} />
    </OrgPermission>
  )
}

AdminDashboardContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(AdminDashboardContainer)
