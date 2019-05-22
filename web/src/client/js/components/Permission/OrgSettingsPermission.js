import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

const OrgSettingsPermission = ({ children, elseRender, acceptedFlags }) => {
  const { data: organization } = useDataService(dataMapper.organizations.current())

  if (organization && acceptedFlags.any(flag => organization[flag])) {
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

OrgSettingsPermission.propTypes = {
  children: PropTypes.node.isRequired,
  elseRender: PropTypes.node,
  acceptedFlags: PropTypes.array.isRequired
}

export default OrgSettingsPermission
