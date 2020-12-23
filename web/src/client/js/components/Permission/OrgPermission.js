import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

const OrgPermission = ({ children, elseRender, acceptedRoleIds = [], acceptedSettings = [], acceptedSubscriptionStatuses = [] }) => {
  const { data: currentUser, loading: userLoading } = useDataService(dataMapper.users.current())
  const { data: organization, loading: orgLoading } = useDataService(dataMapper.organizations.current())

  // check if either user or org loading hasn't been triggered yet, or is currently loading, if so always return null
  if (userLoading || userLoading == null || !currentUser) {
    return <>{null}</>
  }
  if (orgLoading || orgLoading == null || !organization) {
    return <>{null}</>
  }

  if (currentUser && acceptedRoleIds.includes(currentUser.orgRoleId)) {
    return (
      <>
        {children}
      </>
    )
  }

  if (organization && acceptedSettings.some(flag => organization[flag])) {
    return (
      <>
        {children}
      </>
    )
  }

  if (organization && acceptedSubscriptionStatuses.includes(organization.subscriptionStatus)) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <>
      {elseRender}
    </>
  )
}

OrgPermission.propTypes = {
  children: PropTypes.node.isRequired,
  elseRender: PropTypes.node,
  acceptedRoleIds: PropTypes.array,
  acceptedSettings: PropTypes.array
}

export default OrgPermission

export const withOrgPermission = (acceptedRoleIds, acceptedSettings, elseRender) => {
  return (WrappedComponent) => {
    class HOC extends React.Component {
      render() {
        return (
          <OrgPermission acceptedRoleIds={acceptedRoleIds} acceptedSettings={acceptedSettings} elseRender={elseRender}>
            <WrappedComponent {...this.props} />
          </OrgPermission>
        )
      }
    }

    return HOC
  }
}
