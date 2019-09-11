import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import FileUploaderComponent from 'Components/FileUploader/FileUploaderComponent'
import { MAX_FILE_SIZE } from 'Shared/constants'
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

const FieldImageComponent = ({ field, onChange, onRename, settingsHandler, settingsMode, updating }) => {
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
        <img src={field.value} alt={field.name} ref={imageNodeRef} />
        }
      </div>
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
          className="btn btn--blank document-field__settings__button"
          onClick={(e) => { e.preventDefault(); settingsHandler(field.id) }}>
          Cancel
        </button>
        }
        {warning &&
        <p className="small warning">{warning}</p>
        }
      </FileUploaderComponent>
      }
      {settingsMode && field.value &&
      <div className="document-field__settings">
        <label>
          <span className="document-field__settings__label">Photo name:</span>
          <input
            className="document-field__settings__input"
            defaultValue={field.name}
            onChange={(e) => { onRename(field.id, e.currentTarget.value) }}
            type="text"
          />
        </label>
        <button
          className="btn btn--small document-field__settings__button"
          onClick={(e) => { e.preventDefault(); settingsHandler(field.id) }}>
          Exit settings
        </button>
      </div>
      }
    </div>
  )
}

FieldImageComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
}

FieldImageComponent.defaultProps = {
  updating: false,
}

export default FieldImageComponent
