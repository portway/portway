import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router-dom'
import { connect } from 'react-redux'

import { PATH_PAYMENT } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import AdminPaymentComponent from './AdminPaymentComponent'

const AdminPaymentContainer = ({ errors, isSubmitting }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const { data: orgBilling } = useDataService(dataMapper.organizations.billing(), [currentOrg.plan])
  const [isStripeOpen, setIsStripeOpen] = useState(false)
  const routeMatch = useRouteMatch(PATH_PAYMENT)

  useEffect(() => {
    if (routeMatch && routeMatch.isExact) {
      setIsStripeOpen(true)
    }
    if (!routeMatch && isStripeOpen) {
      setIsStripeOpen(false)
    }
  }, [isStripeOpen, routeMatch])

  return (
    <AdminPaymentComponent
      errors={errors}
      isStripeOpen={isStripeOpen}
      isSubmitting={isSubmitting}
      organization={currentOrg}
      orgBilling={orgBilling}
    />
  )
}

AdminPaymentContainer.propTypes = {
  errors: PropTypes.object,
  isStripeOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.organization,
    isSubmitting: state.ui.billing.isSubmitting,
    isStripeOpen: state.ui.billing.isStripeOpen,
  }
}

export default connect(mapStateToProps)(AdminPaymentContainer)
