import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import TextField from 'Components/Form/TextField'
import FileField from 'Components/Form/FileField'
import SpinnerContainer from 'Components/Spinner/SpinnerContainer'

import './_UserProfile.scss'

const UserProfileComponent = ({ errors, user, submitHandler }) => {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  function formSubmitHandler(e) {
    e.preventDefault()
    submitHandler({ name, email })
    return false
  }

  const emailHelpText = `Remember, your email address is your username! We will validate this email before changing it.`

  return (
    <form onSubmit={formSubmitHandler}>
      <section>
        <h2>Your information</h2>
        <TextField
          errors={errors.name}
          id="userName"
          label="Full name"
          name="name"
          onBlur={(e) => { setName(e.target.value)} }
          placeholder="Enter your full name"
          required
          value={user.name}
        />
        <TextField
          errors={errors.email}
          help={emailHelpText}
          id="userEmail"
          label="Email address"
          name="email"
          onBlur={(e) => { setEmail(e.target.value)} }
          placeholder="name@domain.com"
          required
          type="email"
          value={user.email}
        />
      </section>
      <section>
        <h2>Your Image</h2>
        <div className="user-profile__image">
          <UserIcon width="32" height="32" />
          <FileField id="userAvatar" name="avatar" />
        </div>
      </section>
      <div className="btn-group">
        <button className="btn btn-primary">Update My Profile <SpinnerContainer color="#ffffff" /></button>
      </div>
    </form>
  )
}

UserProfileComponent.propTypes = {
  errors: PropTypes.object,
  user: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired
}

UserProfileComponent.defaultProps = {
  user: {}
}

export default UserProfileComponent
