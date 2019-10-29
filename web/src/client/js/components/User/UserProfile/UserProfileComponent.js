import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'

import './_UserProfile.scss'

const UserProfileComponent = ({ errors, formId, user, submitHandler }) => {
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)

  function formSubmitHandler() {
    if (name || email) {
      submitHandler({ name, email })
    }
  }

  const emailHelpText = `Remember, your email address is your username! We will validate this email before changing it.`

  return (
    <section>
      <Form name={formId} onSubmit={formSubmitHandler} submitLabel="Update my profile">
        <h2>Your information</h2>
        <FormField
          errors={errors.name}
          id="userName"
          label="Full name"
          name="name"
          onChange={(e) => { setName(e.target.value) }}
          placeholder="Enter your full name"
          // @todo add back in required
          value={user.name}
        />
        <FormField
          errors={errors.email}
          help={emailHelpText}
          id="userEmail"
          label="Email address"
          name="email"
          onChange={(e) => { setEmail(e.target.value) }}
          placeholder="name@domain.com"
          required
          type="email"
          value={user.email}
        />
      </Form>
    </section>
  )
}

UserProfileComponent.propTypes = {
  errors: PropTypes.object,
  formId: PropTypes.string,
  submitHandler: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

UserProfileComponent.defaultProps = {
  errors: {},
  user: {}
}

export default UserProfileComponent
