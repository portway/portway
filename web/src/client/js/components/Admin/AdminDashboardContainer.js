import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS } from 'Shared/constants'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminDashboardComponent from './AdminDashboardComponent'

const AdminDashboardContainer = ({ match }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  return (
    <OrgPermission
      acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
      elseRender={(<Redirect to={PATH_PROJECTS} />)}>
      <AdminDashboardComponent organization={currentOrg} section={match.params.section} />
    </OrgPermission>
  )
}

AdminDashboardContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(AdminDashboardContainer)
