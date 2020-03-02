import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { MAX_FILE_SIZE } from 'Shared/constants'
import FileUploaderComponent from 'Components/FileUploader/FileUploaderComponent'
import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import './FieldImage.scss'

const ALLOWED_TYPES = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/x-icon'
]

const FieldImageComponent = ({
  field,
  onChange,
  onRename,
  readOnly,
  settingsHandler,
  settingsMode,
  updating
}) => {
  const [warning, setWarning] = useState(null)
  const imageNodeRef = useRef()

  function uploadImage(file) {
    setWarning(null)
    if (file.size >= MAX_FILE_SIZE) {
      setWarning(`Your image must be less than ${MAX_FILE_SIZE / 100}MB.`)
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setWarning(`The image type "${file.type}" is not supported.`)
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    if (!field.value) {
      formData.append('name', file.name)
    }
    onChange(field.id, formData)
    previewImage(file)
  }

  function previewImage(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      field.value = reader.result
    }
  }

  return (
    <div className="document-field__image">
      <div className="document-field__image-container">
        {field.value &&
        <img src={field.value} alt={field.name} ref={imageNodeRef} lazy="true" />
        }
        {(settingsMode || !field.value || updating) &&
        <FileUploaderComponent
          accept="image/*"
          hasValue={field.value !== null}
          isUpdating={updating}
          label="Drag and drop an image"
          fileChangeHandler={uploadImage}
          fileUploadedHandler={() => { settingsHandler(field.id) }}>
          {settingsMode &&
          <button
            className="btn btn--blank"
            onClick={(e) => { e.preventDefault(); settingsHandler(field.id) }}>
            Cancel
          </button>
          }
          {warning &&
          <p className="small warning">{warning}</p>
          }
        </FileUploaderComponent>
        }
      </div>
      {settingsMode && field.value &&
      <div className="document-field__settings">
        <Form
          id="field-image-settings"
          name="field-image-settings"
          onSubmit={() => { settingsHandler(field.id) }}
          submitLabel="Save settings"
        >
          <FormField
            className="document-field__settings__input"
            defaultValue={field.name}
            id={`document-field-name-${field.id}`}
            label="Image name"
            name="field-name"
            onChange={(e) => { onRename(field.id, e.currentTarget.value) }}
          />
        </Form>
      </div>
      }
    </div>
  )
}

FieldImageComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
}

FieldImageComponent.defaultProps = {
  updating: false,
}

export default FieldImageComponent
