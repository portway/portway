import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

const OrgPlanPermission = ({ children, elseRender, acceptedPlans = [] }) => {
  const { data: organization, loading: orgLoading } = useDataService(dataMapper.organizations.current())

  if (orgLoading || orgLoading == null) {
    return <>{null}</>
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
