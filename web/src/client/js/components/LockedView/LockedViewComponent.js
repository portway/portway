import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_BILLING } from 'Shared/constants'

const LockedViewComponent = ({ userRole }) => {
  return (
    <section>
      <div className="notice">
        <h2 className="notice__header">Account Locked</h2>
        {userRole === ORGANIZATION_ROLE_IDS.OWNER &&
        <>
          <p>There is a payment issue with your account. Please check your billing & payment information.</p>
          <Link to={PATH_BILLING} className="btn">Fix</Link>
        </>
        }
        {userRole !== ORGANIZATION_ROLE_IDS.OWNER &&
        <>
          <p>There is a payment issue with your account. Contact your organization owner.</p>
        </>
        }
      </div>
    </section>
  )
}

LockedViewComponent.propTypes = {
  userRole: PropTypes.number,
}

export default LockedViewComponent
