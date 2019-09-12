import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import TextField from 'Components/Form/TextField'
import FileField from 'Components/Form/FileField'
import SpinnerContainer from 'Components/Spinner/SpinnerContainer'

import './_UserProfile.scss'

const UserProfileComponent = ({ avatarHandler, errors, loading, user, submitHandler }) => {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [preview, setPreview] = useState(user.avatar)
  const [avatar, setAvatar] = useState(user.avatar)

  function formSubmitHandler(e) {
    e.preventDefault()
    submitHandler({ name, email })
    return false
  }

  function avatarUpdateHandler(e) {
    e.preventDefault()
    avatarHandler({ avatar })
    return false
  }

  const emailHelpText = `Remember, your email address is your username! We will validate this email before changing it.`
  const avatarHelpText = `Upload a square image - Formatted as PNG or JPG`

  function renderUserAvatar() {
    if (preview) {
      return <img src={preview} alt={`${name}'s avatar`} width="32" height="32" />
    }
    return <UserIcon width="32" height="32" />
  }

  return (
    <>
      <section>
        <form onSubmit={formSubmitHandler}>
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
        </form>
        <div className="btn-group">
          <button className="btn btn--small" disabled={loading}>Update My Profile <SpinnerContainer color="#ffffff" /></button>
        </div>
      </section>
      <hr />
      <section>
        <form onSubmit={avatarUpdateHandler}>
          <h2>Your Avatar</h2>
          <div className="user-profile__image">
            {renderUserAvatar()}
            <FileField
              accept="image/png, image/jpeg"
              help={avatarHelpText}
              id="userAvatar"
              errors={errors.avatar}
              name="avatar"
              onChange={(e) => {
                const data = e.target.files
                const files = Array.from(data)
                const formData = new FormData()
                formData.append('file', files[0])
                setAvatar(formData)
                // Show preview
                const reader = new FileReader()
                reader.readAsDataURL(files[0])
                reader.onloadend = function() {
                  setPreview(reader.result)
                }
              }}
            />
          </div>
          <div className="btn-group">
            <button className="btn btn--small" disabled={loading}>Update My Avatar <SpinnerContainer color="#ffffff" /></button>
          </div>
        </form>
      </section>
    </>
  )
}

UserProfileComponent.propTypes = {
  avatarHandler: PropTypes.func.isRequired,
  errors: PropTypes.object,
  loading: PropTypes.bool,
  submitHandler: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

UserProfileComponent.defaultProps = {
  loading: true,
  user: {}
}

export default UserProfileComponent
