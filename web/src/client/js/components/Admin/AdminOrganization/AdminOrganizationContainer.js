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
import AdminBrandingComponent from './AdminBrandingComponent'

const AdminOrganizationContainer = ({ errors, updateOrganization, updateOrganizationAvatar }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  if (!currentOrg) return null

  const orgProfileId = 'org-profile'
  const orgAvatarId = 'org-avatar'

  function submitHandler(values) {
    if (values.name === null) values.name = currentOrg.name
    if (values.allowUserProjectCreation === null) values.allowUserProjectCreation = currentOrg.allowUserProjectCreation
    updateOrganization(orgProfileId, currentOrg.id, values)
  }

  function avatarUpdateHandler(value) {
    updateOrganizationAvatar(orgAvatarId, currentOrg.id, value.avatar)
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Organization Info – {PRODUCT_NAME}</title>
      </Helmet>
      <>
        <AdminOrganizationComponent
          errors={errors}
          formId={orgProfileId}
          organization={currentOrg}
          submitHandler={submitHandler}
        />
        <hr />
        <AdminBrandingComponent
          errors={errors}
          formId={orgAvatarId}
          organization={currentOrg}
          submitHandler={avatarUpdateHandler}
        />
      </>
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
