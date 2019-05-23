import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import TextField from 'Components/Form/TextField'
import FileField from 'Components/Form/FileField'

import './_UserProfile.scss'

const UserProfileComponent = ({ user, submitHandler }) => {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  function formSubmitHandler(e) {
    e.preventDefault()
    submitHandler({ name, email })
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <section>
        <h2>Your information</h2>
        <TextField
          id="userName"
          label="Full name"
          name="name"
          onChange={(e) => { setName(e.value)} }
          placeholder="Enter your full name"
          value={user.name} />
        <TextField
          id="userEmail"
          label="Email address"
          name="email"
          onChange={(e) => { setEmail(e.value)} }
          placeholder="name@domain.com"
          type="email"
          value={user.email} />
      </section>
      <section>
        <h2>Your Image</h2>
        <div className="user-profile__image">
          <UserIcon width="32" height="32" />
          <FileField id="userAvatar" name="avatar" />
        </div>
      </section>
      <div className="btn-group">
        <button className="btn btn-primary">Update My Profile</button>
      </div>
    </form>
  )
}

UserProfileComponent.propTypes = {
  user: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired
}

UserProfileComponent.defaultProps = {
  user: {}
}

export default UserProfileComponent
