import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { MAX_AVATAR_SIZE } from 'Shared/constants'
import { UserIcon } from 'Components/Icons'
import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import ImageCropperComponent from 'Components/ImageCropper/ImageCropperComponent'

import './AdminOrganization.scss'

const AdminBrandingComponent = ({ errors, formId, organization, submitHandler }) => {
  const [preview, setPreview] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [warning, setWarning] = useState(null)
  const imageRef = useRef()

  function formAvatarHandler(e) {
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
    formData.append('file', croppedImage.blobData, 'org-avatar.png')
    setAvatar(formData)
    // This is for debugging purposes
    if (imageRef && imageRef.current) {
      imageRef.current.src = croppedImage.blobURL
    }
  }

  function renderOrganizationAvatar() {
    if (preview) {
      return (
        <>
          <ImageCropperComponent circle={true} image={preview} onComplete={cropCompleteHandler}>
            <p>
              Your branding will look best as a square.<br />
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
    return <UserIcon width="64" height="64" />
  }

  const avatarHelpText = `Upload a square image - Formatted as PNG or JPG`
  const classes = cx({
    'admin-organization__image': true,
    'admin-organization__image--with-preview': preview
  })

  return (
    <section>
      <Form name={formId} onSubmit={formAvatarHandler} submitLabel={`Update ${organization.name}’s logo`}>
        <h2>Branding</h2>
        <div className={classes}>
          {renderOrganizationAvatar()}
          {!preview &&
            <FormField
              accept="image/png, image/jpeg"
              help={avatarHelpText}
              id="orgAvatar"
              errors={errors.file}
              label={`${organization.name}’s logo`}
              name="avatar"
              onChange={(e) => {
                const data = e.target.files
                const files = Array.from(data)

                if (files[0].size >= MAX_AVATAR_SIZE) {
                  setWarning(`File size must be less than ${MAX_AVATAR_SIZE / 1000}K`)
                  return
                }

                // Show preview to crop
                const reader = new FileReader()
                reader.readAsDataURL(files[0])
                reader.onloadend = function() {
                  setPreview(reader.result)
                }
              }}
              type="file"
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

AdminBrandingComponent.propTypes = {
  errors: PropTypes.object,
  formId: PropTypes.string,
  organization: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired
}

AdminBrandingComponent.defaultProps = {
  errors: {},
  organization: {}
}

export default AdminBrandingComponent
