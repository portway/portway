import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cx from 'classnames'

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

const AdminPaymentComponent = ({ errors, isStripeOpen, isSubmitting, openStripeHandler, orgBilling }) => {
  if (!isStripeOpen && Object.keys(orgBilling).length === 0) {
    return (
      <div className="admin-payment">
        <>
          <p>We don’t have payment on file</p>
          <button className="btn btn--small" onClick={() => { openStripeHandler(true) }}>Add Payment Info</button>
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
          <StripeContainer cancelHandler={() => { openStripeHandler(false) }} isSubmitting={isSubmitting} />
        </>
      </div>
    )
  }

  if (orgBilling && orgBilling.source) {
    const expDateCalc = moment(`${orgBilling.source.exp_year}-${orgBilling.source.exp_month}-01`)
    const expDate = moment(`${orgBilling.source.exp_year}-${orgBilling.source.exp_month}-01`)
    const expiringSoon = moment() > expDateCalc.add(1, 'months')
    const expiringClass = cx({
      'admin-payment__card-expiration': true,
      'admin-payment__card-expiration--soon': expiringSoon
    })
    return (
      <div className="admin-payment">
        {!isStripeOpen && orgBilling && orgBilling.source.brand &&
        <>
          <p>You will be billed <b>$10</b> on <b>September 19, 2019</b></p>
          <div className="admin-payment__method">
            {orgBilling.source.brand !== 'Unknown' && renderCardLogo(orgBilling.source.brand)}
            <span className="admin-payment__card-type">{orgBilling.source.brand === 'Unknown' && <>Credit Card </>} ending in</span>
            <span className="admin-payment__card-ending"> {orgBilling.source.last4}</span>
            <span>Expires: </span>
            <span className={expiringClass}>{expDate.format('MMMM, YYYY')}</span>
          </div>
          <button className="btn btn--small" onClick={() => { openStripeHandler(true) }}>Change Payment Info</button>
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
  openStripeHandler: PropTypes.func.isRequired,
  orgBilling: PropTypes.object,
}

AdminPaymentComponent.defaultProps = {
  errors: [],
  orgBilling: {}
}

export default AdminPaymentComponent
