import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { MULTI_USER_PLAN_TYPES, ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'
import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'

import './AdminOrganization.scss'

const AdminOrganizationComponent = ({ errors, formId, organization, submitHandler }) => {
  const [name, setName] = useState(null)
  const [allowUserProjectCreation, setAllowUserProjectCreation] = useState(null)

  function formSubmitHandler(e) {
    if (name || allowUserProjectCreation !== null) {
      submitHandler({ name, allowUserProjectCreation })
      setName(null)
      setAllowUserProjectCreation(null)
    }
  }

  const helpText = 'Checking this box allows anyone in your organization to create projects'

  return (
    <section>
      <Form name={formId} onSubmit={formSubmitHandler} submitLabel={`Update ${organization.name}`}>
        <h2>General information</h2>
        <FormField
          errors={errors.name}
          id="orgName"
          label="Organization name"
          name="name"
          onChange={(e) => {
            setName(e.target.value)
          }}
          placeholder="ACME, Inc"
          required
          value={organization.name}
        />
        <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES} acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE]}>
          <FormField
            errors={errors.privacy}
            help={helpText}
            id="orgProjectCreation"
            label={`Everyone in ${organization.name} can create projects`}
            large={true}
            name="organization[allowUserProjectCreation]"
            onChange={(e) => {
              setAllowUserProjectCreation(e.target.checked)
            }}
            type="checkbox"
            value={organization.allowUserProjectCreation}
          />
        </OrgPlanPermission>
      </Form>
    </section>
  )
}

AdminOrganizationComponent.propTypes = {
  errors: PropTypes.object,
  formId: PropTypes.string,
  organization: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired
}

AdminOrganizationComponent.defaultProps = {
  errors: {},
  organization: {}
}

export default AdminOrganizationComponent
