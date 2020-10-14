import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cx from 'classnames'

const ProjectSettingsDeliveries = ({ deliveries }) => {
  return (
    <div className="webhooks-list__delivery-data">
      {deliveries.map((delivery) => {
        const codeClasses = cx({
          'webhooks-list__delivery-code': true,
          'webhooks-list__delivery-code--success': delivery.resultCode < 300,
          'webhooks-list__delivery-code--error': delivery.resultCode > 300,
        })
        return (
          <div key={delivery.id}>
            <span className={codeClasses}>{delivery.resultCode}</span>
            <span className="webhooks-list__delivery-date">{moment(delivery.createdAt).format('YYYY-MM-DD')}</span>
          </div>
        )
      })}
    </div>
  )
}

ProjectSettingsDeliveries.propTypes = {
  deliveries: PropTypes.array.isRequired,
}

export default ProjectSettingsDeliveries
