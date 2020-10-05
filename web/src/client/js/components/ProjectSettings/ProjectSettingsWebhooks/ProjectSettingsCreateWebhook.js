import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'

const ProjectSettingsCreateWebhook = ({ errors, formId, submitHandler }) => {
  const [url, setURL] = useState(null)

  function formSubmitHandler(e) {
    if (url !== '') {
      submitHandler(url)
    }
  }

  return (
    <Form
      inline={true}
      name={formId}
      onSubmit={formSubmitHandler}
      submitLabel={`Add endpoint`}
      submitOnRight
    >
      <FormField
        errors={errors.url}
        id="url"
        label="Add new webhook URL"
        name="url"
        onChange={(e) => {
          setURL(e.target.value)
        }}
        placeholder="https://path/to/endpoint"
        required
      />
    </Form>
  )
}

ProjectSettingsCreateWebhook.propTypes = {
  errors: PropTypes.object,
  formId: PropTypes.string.isRequired,
  submitHandler: PropTypes.func.isRequired,
  webhook: PropTypes.object,
}

ProjectSettingsCreateWebhook.defaultProps = {
  errors: {}
}

export default ProjectSettingsCreateWebhook
