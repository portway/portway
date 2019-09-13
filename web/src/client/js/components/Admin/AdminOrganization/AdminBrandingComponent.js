import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { MAX_AVATAR_SIZE } from 'Shared/constants'
import { UserIcon } from 'Components/Icons'
import Form from 'Components/Form/Form'
import FileField from 'Components/Form/FileField'

import './AdminOrganization.scss'

const AdminBrandingComponent = ({ errors, formId, organization, submitHandler }) => {
  const [preview, setPreview] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [warning, setWarning] = useState(null)

  function formAvatarHandler(e) {
    if (avatar) {
      submitHandler({ avatar })
      setPreview(null)
      setAvatar(null)
    }
  }

  function renderOrganizationAvatar() {
    if (preview) {
      return <img src={preview} alt={`${organization.name}'s avatar`} width="32" height="32" />
    }
    return <UserIcon width="32" height="32" />
  }

  const avatarHelpText = `Upload a square image - Formatted as PNG or JPG`

  return (
    <section>
      <Form name={formId} onSubmit={formAvatarHandler} submitLabel={`Update ${organization.name}`}>
        <h2>Branding</h2>
        <div className="admin-organization__image">
          {renderOrganizationAvatar()}
          <FileField
            accept="image/png, image/jpeg"
            help={avatarHelpText}
            id="orgAvatar"
            errors={errors.avatar}
            name="avatar"
            onChange={(e) => {
              const data = e.target.files
              const files = Array.from(data)

              if (files[0].size >= MAX_AVATAR_SIZE) {
                setWarning(`File size must be less than ${MAX_AVATAR_SIZE / 10}K`)
                return
              }

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
