import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { ORGANIZATION_ROLE_IDS, PRODUCT_NAME, PATH_PROJECTS } from 'Shared/constants'
import OrgPermission from 'Components/Permission/OrgPermission'
import { updateOrganization } from 'Actions/organization'
import UserOrganizationComponent from './UserOrganizationComponent'

const UserOrganizationContainer = ({ errors, updateOrganization }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  if (!currentOrg) return null

  function submitHandler(values) {
    updateOrganization(currentOrg.id, values)
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
  errors: PropTypes.object,
  updateOrganization: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.organization
  }
}

const mapDispatchToProps = { updateOrganization }

export default connect(mapStateToProps, mapDispatchToProps)(UserOrganizationContainer)
