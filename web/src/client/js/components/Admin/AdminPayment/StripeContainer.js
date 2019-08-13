import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Elements, StripeProvider } from 'react-stripe-elements'

import Store from '../../../reducers'
import { updateOrganizationBilling } from 'Actions/organization'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS } from 'Shared/constants'
import { currentOrgId } from 'Libs/currentIds'
import OrgPermission from 'Components/Permission/OrgPermission'
import StripeComponent from './StripeComponent'

class StripeContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      isTrusted: false,
      stripeKey: 'pk_test_1pwhBFZzMbjvUlsgn2EjsfWP',
      stripe: null
    }
    // Load stripe library dynamically
    if (!window.Stripe) {
      this.insertStripe()
    }
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({
        stripe: window.Stripe(this.state.stripeKey)
      })
    } else {
      this.insertStripe()
    }
  }

  insertStripe() {
    const stripeScript = document.createElement('script')
    stripeScript.src = 'https://js.stripe.com/v3/'
    stripeScript.async = true
    stripeScript.onerror = this.stripeErrorHandler.bind(this)
    stripeScript.onload = this.stripeLoadedHandler.bind(this)
    document.body.appendChild(stripeScript)
  }

  render() {
    return (
      <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
        <StripeProvider stripe={this.state.stripe}>
          <Elements>
            <StripeComponent
              cancelHandler={this.props.cancelHandler}
              isSubmitting={this.props.isSubmitting}
              orgId={currentOrgId}
              updateBillingHandler={this.updateBillingHandler}
            />
          </Elements>
        </StripeProvider>
      </OrgPermission>
    )
  }

  updateBillingHandler(token) {
    Store.dispatch(updateOrganizationBilling(currentOrgId, { token: token.id }))
  }

  stripeLoadedHandler(data) {
    // If we've loaded Stripe successfully, render the component
    this.setState({
      loading: false,
      isTrusted: data.isTrusted,
      stripe: window.Stripe(this.state.stripeKey)
    })
  }

  stripeErrorHandler(err) {
    if (err) {
      throw new URIError('Error loading Stripe.')
    }
  }
}

StripeContainer.propTypes = {
  cancelHandler: PropTypes.func,
  isSubmitting: PropTypes.bool
}

export default StripeContainer
