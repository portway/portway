import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { uiToggleStripeForm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import UserPaymentComponent from './UserPaymentComponent'

const UserPaymentContainer = ({ isStripeOpen, isSubmitting, uiToggleStripeForm }) => {
  const { data: orgBilling } = useDataService(dataMapper.organizations.billing())

  return (
    <UserPaymentComponent
      isStripeOpen={isStripeOpen}
      isSubmitting={isSubmitting}
      openStripeHandler={uiToggleStripeForm}
      orgBilling={orgBilling}
    />
  )
}

UserPaymentContainer.propTypes = {
  isStripeOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  uiToggleStripeForm: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    isSubmitting: state.ui.billing.isSubmitting,
    isStripeOpen: state.ui.billing.isStripeOpen
  }
}

const mapDispatchToProps = { uiToggleStripeForm }

export default connect(mapStateToProps, mapDispatchToProps)(UserPaymentContainer)
