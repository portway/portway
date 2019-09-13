import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import Form from 'Components/Form/Form'
import FileField from 'Components/Form/FileField'

import './_UserProfile.scss'

const UserProfileComponent = ({ errors, formId, user, submitHandler }) => {
  const [preview, setPreview] = useState(null)
  const [avatar, setAvatar] = useState(null)

  function formSubmitHandler(e) {
    if (avatar) {
      submitHandler({ avatar })
      setPreview(null)
      setAvatar(null)
    }
  }

  const avatarHelpText = `Upload a square image - Formatted as PNG or JPG`

  function renderUserAvatar() {
    if (preview) {
      return <img src={preview} alt={`${user.name}'s avatar`} width="32" height="32" />
    }
    return <UserIcon width="32" height="32" />
  }

  return (
    <section>
      <Form name={formId} onSubmit={formSubmitHandler} submitLabel="Update my avatar">
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
  user: {}
}

export default UserProfileComponent
