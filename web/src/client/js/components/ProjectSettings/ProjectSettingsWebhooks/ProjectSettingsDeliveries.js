import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cx from 'classnames'

const ProjectSettingsDeliveries = ({ deliveries }) => {
  return (
    <div className="webhooks-list__delivery-data">
      <table>
        <thead>
          <tr>
            <th className="webhooks-list__header">Response code</th>
            <th className="webhooks-list__header">Date</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => {
            const codeClasses = cx({
              'webhooks-list__delivery-code': true,
              'webhooks-list__delivery-code--success': delivery.resultCode < 300,
              'webhooks-list__delivery-code--error': delivery.resultCode > 300,
            })
            return (
              <tr key={delivery.id}>
                <td className={codeClasses}>{delivery.resultCode}</td>
                <td className="webhooks-list__delivery-date">{moment(delivery.createdAt).format('YYYY-MM-DD')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

ProjectSettingsDeliveries.propTypes = {
  deliveries: PropTypes.array.isRequired,
}

export default ProjectSettingsDeliveries
