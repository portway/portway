import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, useHistory } from 'react-router-dom'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import Store from '../../../reducers'
import { updateOrganizationBilling } from 'Actions/organization'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS } from 'Shared/constants'
import { currentOrgId } from 'Libs/currentIds'
import OrgPermission from 'Components/Permission/OrgPermission'
import StripeComponent from './StripeComponent'

// STRIPE_PUBLISHABLE_KEY is defined inline in the HTML
// eslint-disable-next-line no-undef
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

const StripeContainer = ({ isSubmitting }) => {
  const history = useHistory()

  function updateBillingHandler(token) {
    Store.dispatch(updateOrganizationBilling(currentOrgId, history, { token: token.id }))
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Elements stripe={stripePromise}>
        <StripeComponent
          isSubmitting={isSubmitting}
          orgId={currentOrgId}
          updateBillingHandler={updateBillingHandler}
        />
      </Elements>
    </OrgPermission>
  )
}

StripeContainer.propTypes = {
  isSubmitting: PropTypes.bool
}

export default StripeContainer
