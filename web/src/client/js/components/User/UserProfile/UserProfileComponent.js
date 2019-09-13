import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import TextField from 'Components/Form/TextField'
import FileField from 'Components/Form/FileField'

import './_UserProfile.scss'

const UserProfileComponent = ({ avatarUpdateHandler, errors, loading, user, submitHandler }) => {
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [preview, setPreview] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [formChanged, setFormChanged] = useState(false)
  const [avatarChanged, setAvatarChanged] = useState(false)

  function formSubmitHandler(e) {
    e.preventDefault()
    if (name || email) {
      submitHandler({ name, email })
      setFormChanged(false)
    }
    return false
  }

  function formAvatarHandler(e) {
    e.preventDefault()
    if (avatar) {
      avatarUpdateHandler({ avatar })
      setAvatarChanged(false)
      setPreview(null)
      setAvatar(null)
      e.target.reset()
    }
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

  const disabledUserButton = !formChanged || loading
  const disabledAvatarButton = !avatarChanged || loading

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
            onChange={(e) => {
              setFormChanged(true)
              setName(e.target.value)
            }}
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
            onChange={(e) => {
              setAvatarChanged(true)
              setEmail(e.target.value)
            }}
            placeholder="name@domain.com"
            required
            type="email"
            value={user.email}
          />
          <div className="btn-group">
            <button className="btn btn--small" disabled={disabledUserButton}>Update My Profile</button>
          </div>
        </form>
      </section>
      <hr />
      <section>
        <form onSubmit={formAvatarHandler}>
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
                setAvatarChanged(true)
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
            <button className="btn btn--small" disabled={disabledAvatarButton}>Update My Avatar</button>
          </div>
        </form>
      </section>
    </>
  )
}

UserProfileComponent.propTypes = {
  avatarUpdateHandler: PropTypes.func.isRequired,
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
