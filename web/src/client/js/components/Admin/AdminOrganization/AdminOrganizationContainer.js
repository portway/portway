import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { ORGANIZATION_ROLE_IDS, PRODUCT_NAME, PATH_PROJECTS } from 'Shared/constants'
import OrgPermission from 'Components/Permission/OrgPermission'
import { updateOrganization, updateOrganizationAvatar } from 'Actions/organization'
import AdminOrganizationComponent from './AdminOrganizationComponent'

const AdminOrganizationContainer = ({ errors, updateOrganization, updateOrganizationAvatar }) => {
  const { data: currentOrg, loading } = useDataService(dataMapper.organizations.current())
  if (!currentOrg) return null

  function submitHandler(values) {
    if (values.name === null) values.name = currentOrg.name
    if (values.allowUserProjectCreation === null) values.allowUserProjectCreation = currentOrg.allowUserProjectCreation
    updateOrganization(currentOrg.id, values)
  }

  function avatarUpdateHandler(value) {
    updateOrganizationAvatar(currentOrg.id, value.avatar)
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Organization Info – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminOrganizationComponent
        avatarUpdateHandler={avatarUpdateHandler}
        errors={errors}
        loading={loading}
        organization={currentOrg}
        submitHandler={submitHandler}
      />
    </OrgPermission>
  )
}

AdminOrganizationContainer.propTypes = {
  errors: PropTypes.object,
  updateOrganization: PropTypes.func.isRequired,
  updateOrganizationAvatar: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.organization
  }
}

const mapDispatchToProps = { updateOrganization, updateOrganizationAvatar }

export default connect(mapStateToProps, mapDispatchToProps)(AdminOrganizationContainer)
