import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { ORGANIZATION_ROLE_IDS, PRODUCT_NAME, PATH_PROJECTS } from 'Shared/constants'
import OrgPermission from 'Components/Permission/OrgPermission'
import UserOrganizationComponent from './UserOrganizationComponent'

const UserOrganizationContainer = ({ errors }) => {
  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Organization Info – {PRODUCT_NAME}</title>
      </Helmet>
      <UserOrganizationComponent errors={errors} />
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
