import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { ORGANIZATION_ROLE_IDS, PRODUCT_NAME, PATH_PROJECTS } from 'Shared/constants'
import OrgPermission from 'Components/Permission/OrgPermission'
import UserOrganizationComponent from './UserOrganizationComponent'

const UserOrganizationContainer = ({ errors }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  if (!currentOrg) return null

  function submitHandler(values) {
    console.log(values)
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Organization Info – {PRODUCT_NAME}</title>
      </Helmet>
      <UserOrganizationComponent errors={errors} organization={currentOrg} submitHandler={submitHandler} />
    </OrgPermission>
  )
}

UserOrganizationContainer.propTypes = {
  errors: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.organization
  }
}

export default connect(mapStateToProps)(UserOrganizationContainer)
