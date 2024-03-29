import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import { PATH_PAYMENT } from 'Shared/constants'
import ValidationComponent from 'Components/Validation/ValidationComponent'
import StripeContainer from './StripeContainer'
import './_AdminPaymentStyles.scss'

const amexLogo = require('./icons/amex.png')
const dinersClubLogo = require('./icons/diners-club.png')
const discoverLogo = require('./icons/discover.png')
const jcbLogo = require('./icons/jcb.png')
const mastercardLogo = require('./icons/mastercard.png')
const visaLogo = require('./icons/visa.png')

const cardIcons = {
  'American Express': amexLogo,
  'Diners Club': dinersClubLogo,
  'Discover': discoverLogo,
  'JCB': jcbLogo,
  'MasterCard': mastercardLogo,
  'Visa': visaLogo,
}

function renderCardLogo(brand) {
  return <img className="admin-payment__card-image" src={cardIcons[brand]} alt={`${brand} card logo`} width="64" height="40" />
}

function getTotalCost(subscription) {
  if (subscription.flatCost) {
    return subscription.flatCost + (subscription.totalSeats - subscription.includedSeats) * subscription.additionalSeatCost
  } else {
    return '000'
  }
}

function toCurrencyString(num) {
  const numString = num.toString()
  return `${numString.substr(0, numString.length - 2)}.${numString.substr(-2)}`
}

const AdminPaymentComponent = ({
  errors,
  isStripeOpen,
  isSubmitting,
  organization,
  orgBilling
}) => {
  if (!isStripeOpen && !orgBilling.source) {
    return (
      <div className="admin-payment">
        <>
          <p>We don’t have payment information on file</p>
          <Link to={PATH_PAYMENT} className="btn btn--small">Add Payment Info</Link>
        </>
      </div>
    )
  }

  if (isStripeOpen) {
    return (
      <div className="admin-payment">
        <>
          <p>Enter your new card information. We will use this new form of payment from now on.</p>
          <ValidationComponent errors={errors.stripe} />
          <StripeContainer isSubmitting={isSubmitting} />
        </>
      </div>
    )
  }

  if (orgBilling && orgBilling.source) {
    const cost = orgBilling.subscription && toCurrencyString(getTotalCost(orgBilling.subscription))
    // Using the YYYY-M-D format because expYear and expMonth may be single or double digit from the API
    // and Moment needs to have a valid format for display
    const expDateCalc = moment(`${orgBilling.source.expYear}-${orgBilling.source.expMonth}-01`, 'YYYY-M-D')
    const expDate = moment(`${orgBilling.source.expYear}-${orgBilling.source.expMonth}-01`, 'YYYY-M-D')
    const expiringSoon = moment() > expDateCalc.add(1, 'months')
    const nextBillingDate = moment.unix(orgBilling.subscription.currentPeriodEnd)

    const expiringClass = cx({
      'admin-payment__card-expiration': true,
      'admin-payment__card-expiration--soon': expiringSoon
    })

    return (
      <div className="admin-payment">
        {!isStripeOpen && orgBilling && orgBilling.source.brand &&
        <>
          <p className="admin-payment__date">You will be billed <b>${cost}</b> on <b>{nextBillingDate.format('MMMM Do, YYYY')}</b></p>
          <div className="admin-payment__method">
            {orgBilling.source.brand !== 'Unknown' && renderCardLogo(orgBilling.source.brand)}
            <div className="admin-payment__card">
              <span className="admin-payment__card-type">{orgBilling.source.brand === 'Unknown' && <>Credit Card </>} Ending in</span>
              <span className="admin-payment__card-ending"> {orgBilling.source.last4}</span>
            </div>
            <div className="admin-payment__exp">
              <span>Expires: </span>
              <span className={expiringClass}>{expDate.format('MMMM, YYYY')}</span>
            </div>
          </div>
          <Link to={PATH_PAYMENT} className="btn btn--like-a-link">Change Payment Info</Link>
        </>
        }
      </div>
    )
  }
}

AdminPaymentComponent.propTypes = {
  errors: PropTypes.object,
  isStripeOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  organization: PropTypes.object,
  orgBilling: PropTypes.object
}

AdminPaymentComponent.defaultProps = {
  errors: [],
  orgBilling: {}
}

export default AdminPaymentComponent
