import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import moment from 'moment'

import { PATH_PROJECT } from 'Shared/constants'
import { CaretIcon, TrashIcon } from 'Components/Icons'

import ProjectSettingsDeliveries from './ProjectSettingsDeliveries'

const ProjectSettingsWebhooksList = ({
  deliveries,
  deliveriesLoading,
  recentDeliveries,
  removeHandler,
  updateHandler,
  selectedHookId,
  webhooks,
  projectId
}) => {
  return (
    <ol className="webhooks-list">
      {webhooks.map((webhook) => {
        const isSelected = selectedHookId === webhook.id
        const webhookLink = isSelected ?
          `${PATH_PROJECT}/${projectId}/settings/webhooks` :
          `${PATH_PROJECT}/${projectId}/settings/webhooks/${webhook.id}`

        const listClasses = cx({
          'webhooks-list__item': true,
          'webhooks-list__item--active': isSelected
        })

        const pillClasses = cx({
          'pill': true,
          'pill--green': webhook.active,
          'pill--red': !webhook.active,
        })

        const pillLabel = cx({
          'Active': webhook.active,
          'Disabled': !webhook.active,
        })

        const statusClasses = cx({
          'webhooks-list__status': true,
          'webhooks-list__status--success': recentDeliveries[webhook.id] && recentDeliveries[webhook.id].resultCode < 300,
          'webhooks-list__status--failed': recentDeliveries[webhook.id] && recentDeliveries[webhook.id].resultCode > 300,
        })

        const statusLabel = cx({
          'n/a': !recentDeliveries[webhook.id],
          'succeeded': recentDeliveries[webhook.id] && recentDeliveries[webhook.id].resultCode < 300,
          'failed': recentDeliveries[webhook.id] && recentDeliveries[webhook.id].resultCode > 300,
        })

        const toggleButtonClasses = cx({
          'btn btn--small btn--white': webhook.active,
          'btn btn--small': !webhook.active,
        })

        const toggleButtonLabels = cx({
          'Disable webhook': webhook.active,
          'Enable webhook': !webhook.active,
        })

        return (
          <li className={listClasses} key={webhook.id}>
            <Link to={webhookLink} className="webhooks-list__button">
              <span className="webhooks-list__status">
                <span className={pillClasses}>{pillLabel}</span>
              </span>
              <span className="webhooks-list__url">
                <div>
                  <span className="webhooks-list__label">URL</span>
                  <span className="webhooks-list__value">{webhook.url}</span>
                </div>
                <div>
                  <span className="webhooks-list__label">Latest delivery attempt <span className={statusClasses}>{statusLabel}</span></span>
                </div>
              </span>
              <span className="webhooks-list__created">
                <span className="webhooks-list__label">Added</span>
                {moment(webhook.createdAt).format('YYYY-MM-DD')}
              </span>
              <CaretIcon />
            </Link>
            {isSelected &&
            <div className="webhooks-list__details">
              <pre className="webhooks-list__deliveries">
                {deliveriesLoading &&
                <>Loading...</>
                }
                {!deliveriesLoading && deliveries.length === 0 &&
                <>No webhook attempts yet. Try publishing a document in your project.</>
                }
                {!deliveriesLoading && deliveries.length > 0 &&
                <ProjectSettingsDeliveries deliveries={deliveries} />
                }
              </pre>
              <div className="webhooks-list__options">
                <button
                  className={toggleButtonClasses}
                  onClick={() => updateHandler(webhook.id, { active: !webhook.active })}
                >
                  <span className="label">{toggleButtonLabels}</span>
                </button>
                <button
                  className="btn btn--small btn--blank btn--with-circular-icon"
                  onClick={() => removeHandler(webhook.id)}
                >
                  <TrashIcon />
                  <span className="label danger">Delete</span>
                </button>
              </div>
            </div>
            }
          </li>
        )
      })}
    </ol>
  )
}

ProjectSettingsWebhooksList.propTypes = {
  deliveries: PropTypes.array,
  deliveriesLoading: PropTypes.bool,
  projectId: PropTypes.number.isRequired,
  recentDeliveries: PropTypes.object,
  removeHandler: PropTypes.func.isRequired,
  updateHandler: PropTypes.func.isRequired,
  selectedHookId: PropTypes.number,
  webhooks: PropTypes.array,
}

ProjectSettingsWebhooksList.defaultProps = {
  deliveries: []
}

export default ProjectSettingsWebhooksList
