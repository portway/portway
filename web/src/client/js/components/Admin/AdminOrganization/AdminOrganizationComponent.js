import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import SpinnerContainer from 'Components/Spinner/SpinnerContainer'
import TextField from 'Components/Form/TextField'
import Checkbox from 'Components/Form/Checkbox'
import FileField from 'Components/Form/FileField'

import './AdminOrganization.scss'

const AdminOrganizationComponent = ({ avatarUpdateHandler, errors, loading, organization, submitHandler }) => {
  const [name, setName] = useState(null)
  const [allowUserProjectCreation, setAllowUserProjectCreation] = useState(null)
  const [preview, setPreview] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [formChanged, setFormChanged] = useState(false)
  const [avatarChanged, setAvatarChanged] = useState(false)

  function formSubmitHandler(e) {
    e.preventDefault()
    if (name || allowUserProjectCreation !== null) {
      submitHandler({ name, allowUserProjectCreation })
      setFormChanged(false)
      setName(null)
      setAllowUserProjectCreation(null)
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

  function renderOrganizationAvatar() {
    if (preview) {
      return <img src={preview} alt={`${name}'s avatar`} width="32" height="32" />
    }
    return <UserIcon width="32" height="32" />
  }

  const helpText = 'Checking this box allows anyone in your organization to create projects'
  const avatarHelpText = `Upload a square image - Formatted as PNG or JPG`

  const disabledOrgButton = !formChanged || loading
  const disabledAvatarButton = !avatarChanged || loading

  return (
    <>
      <section>
        <form onSubmit={formSubmitHandler}>
          <h2>General information</h2>
          <TextField
            errors={errors.name}
            id="orgName"
            label="Organization Name"
            name="name"
            onChange={(e) => {
              setFormChanged(true)
              setName(e.target.value)
            }}
            placeholder="ACME, Inc"
            required
            value={organization.name}
          />
          <Checkbox
            errors={errors.privacy}
            help={helpText}
            id="orgProjectCreation"
            label={`Everyone in ${organization.name} can create projects`}
            large={true}
            name="organization[allowUserProjectCreation]"
            onChange={(e) => {
              setFormChanged(true)
              setAllowUserProjectCreation(e.target.checked)
            }}
            value={organization.allowUserProjectCreation}
          />
          <div className="btn-group">
            <button className="btn btn--small" disabled={disabledOrgButton}>Update {organization.name} <SpinnerContainer color="#ffffff" /></button>
          </div>
        </form>
      </section>
      <hr />
      <section>
        <form onSubmit={formAvatarHandler}>
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
            <button className="btn btn--small" disabled={disabledAvatarButton}>Update {organization.name}’s Branding <SpinnerContainer color="#ffffff" /></button>
          </div>
        </form>
      </section>
    </>
  )
}

AdminOrganizationComponent.propTypes = {
  avatarUpdateHandler: PropTypes.func.isRequired,
  errors: PropTypes.object,
  loading: PropTypes.bool,
  organization: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired
}

AdminOrganizationComponent.defaultProps = {
  errors: {},
  loading: true,
  organization: {}
}

export default AdminOrganizationComponent
