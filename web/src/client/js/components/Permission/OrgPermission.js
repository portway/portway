import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

const OrgPermission = ({ children, elseRender, acceptedRoleIds }) => {
  const { data: currentUser } = useDataService(dataMapper.users.current())

  if (currentUser && acceptedRoleIds.indexOf(currentUser.orgRoleId) > -1) {
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
  acceptedRoleIds: PropTypes.array.isRequired
}

export default OrgPermission

export const withOrgPermission = (acceptedRoleIds, elseRender) => {
  return (WrappedComponent) => {
    class HOC extends React.Component {
      render() {
        return (
          <OrgPermission acceptedRoleIds={acceptedRoleIds} elseRender={elseRender}>
            <WrappedComponent {...this.props} />
          </OrgPermission>
        )
      }
    }

    return HOC
  }
}
