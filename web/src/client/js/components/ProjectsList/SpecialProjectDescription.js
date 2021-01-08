import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  MULTI_USER_PLAN_TYPES,
  PATH_PROJECT,
  URL_DOCUMENTATION,
  ORG_SUBSCRIPTION_STATUS

} from 'Shared/constants'
import { RemoveIcon, UnlockIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'

import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'

const expiration = moment().subtract(30, 'days')
const lsShowMessage = localStorage.getItem('sp-message')

const SpecialProjectDescription = ({ project }) => {
  const [showMessage, setShowMessage] = useState(lsShowMessage)
  const projectIsOldNow = expiration > moment(project.createdAt)

  function setLocalStorageIgnore() {
    setShowMessage(false)
    localStorage.setItem('sp-message', 'false')
  }

  if (JSON.parse(showMessage) !== false && !projectIsOldNow) {
    return (
      <div className="special-project__description">
        <div className="special-project__description-content">
          <div>
            We’ve created a sample project for you to learn the basics of Portway.<> </>
            <Link to={`${PATH_PROJECT}/${project.id}`}>Edit it</Link>,
            delete it, or do anything else you can think of with the<> </>
            <a href={URL_DOCUMENTATION} target="_blank" rel="noopener noreferrer">Portway API</a>.
          </div>
          <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES} acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE]}>
            <div className="special-project__multi-plan">
              <UnlockIcon fill="#ffffff" />
              <span className="label">Everyone in your organization can edit this project</span>
            </div>
          </OrgPlanPermission>
        </div>
        <IconButton color="brand" onClick={setLocalStorageIgnore}>
          <RemoveIcon fill="#ffffff" width="14" height="14" />
        </IconButton>
      </div>
    )
  }
  return null
}

SpecialProjectDescription.propTypes = {
  project: PropTypes.object.isRequired,
}

export default SpecialProjectDescription
