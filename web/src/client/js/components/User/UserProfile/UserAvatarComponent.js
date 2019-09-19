import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { MAX_AVATAR_SIZE } from 'Shared/constants'
import { UserIcon } from 'Components/Icons'
import Form from 'Components/Form/Form'
import FileField from 'Components/Form/FileField'
import ImageCropperComponent from 'Components/ImageCropper/ImageCropperComponent'

import './_UserProfile.scss'

const UserProfileComponent = ({ errors, formId, user, submitHandler }) => {
  const [preview, setPreview] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [warning, setWarning] = useState(null)
  const imageRef = useRef()

  function formSubmitHandler(e) {
    if (avatar) {
      submitHandler({ avatar })
      setPreview(null)
      setAvatar(null)
    }
  }

  function cancelCropHandler(e) {
    e.preventDefault()
    setPreview(null)
    setAvatar(null)
  }

  function cropCompleteHandler(croppedImage) {
    // Overwrite the formData with the new cropped image
    const formData = new FormData()
    formData.append('file', croppedImage.blobData, 'user-avatar.png')
    setAvatar(formData)
    // This is for debugging purposes
    if (imageRef && imageRef.current) {
      imageRef.current.src = croppedImage.blobURL
    }
  }

  const avatarHelpText = `Upload a square image - Formatted as PNG or JPG`

  function renderUserAvatar() {
    if (preview) {
      return (
        <>
          <ImageCropperComponent circle={true} image={preview} onComplete={cropCompleteHandler}>
            <p>
              Your profile image will look best as a square.<br />
              You can crop your image here before saving it.
            </p>
            <div className="btn-group">
              <button className="btn btn--small" type="submit">Save cropped image</button>
              <button className="btn btn--small btn--blank" type="button" onClick={cancelCropHandler}>Cancel</button>
            </div>
          </ImageCropperComponent>
        </>
      )
    }
    return <UserIcon width="32" height="32" />
  }

  const classes = cx({
    'user-profile__image': true,
    'user-profile__image--with-preview': preview
  })

  return (
    <section>
      <Form name={formId} onSubmit={formSubmitHandler} submitLabel="Update my profile image">
        <h2>Your Profile Image</h2>
        <div className={classes}>
          {renderUserAvatar()}
          {!preview &&
            <FileField
              accept="image/png, image/jpeg"
              help={avatarHelpText}
              id="userAvatar"
              errors={errors.file}
              name="avatar"
              onChange={(e) => {
                const data = e.target.files
                const files = Array.from(data)

                if (files[0].size >= MAX_AVATAR_SIZE) {
                  setWarning(`File size must be less than ${MAX_AVATAR_SIZE / 1000}K`)
                  return
                }

                // Show preview
                const reader = new FileReader()
                reader.readAsDataURL(files[0])
                reader.onloadend = function() {
                  setPreview(reader.result)
                }
              }}
            />
          }
        </div>
        {warning &&
        <p className="small warning">{warning}</p>
        }
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
