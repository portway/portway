import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'

const OrgPlanPermission = ({ children, elseRender, acceptedPlans = [], acceptedSubscriptionStatuses}) => {
  const { data: organization, loading: orgLoading } = useDataService(dataMapper.organizations.current())

  if (orgLoading || orgLoading == null) {
    return <>{null}</>
  }

  if (acceptedSubscriptionStatuses && organization && !acceptedSubscriptionStatuses.includes(organization.subscriptionStatus)) {
    return (
      <>
        {elseRender}
      </>
    )
  }

  if (organization && acceptedPlans.includes(organization.plan)) {
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

OrgPlanPermission.propTypes = {
  children: PropTypes.node.isRequired,
  elseRender: PropTypes.node,
  acceptedPlans: PropTypes.array,
  acceptedSubscriptionStatuses: PropTypes.array
}

export default OrgPlanPermission

export const withOrgPlanPermission = (acceptedPlans, elseRender) => {
  return (WrappedComponent) => {
    class HOC extends React.Component {
      render() {
        return (
          <OrgPlanPermission acceptedPlans={acceptedPlans} elseRender={elseRender}>
            <WrappedComponent {...this.props} />
          </OrgPlanPermission>
        )
      }
    }

    return HOC
  }
}
