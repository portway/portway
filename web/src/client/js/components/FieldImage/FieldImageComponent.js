import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import SpinnerComponent from 'Components/Spinner/SpinnerComponent'
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

const FieldImageComponent = ({ field, onChange, settingsHandler, settingsMode, updating }) => {
  const [draggedOver, setDraggedOver] = useState(false)
  const [uploading, setUploading] = useState(false)
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
    // This is a hack to trigger immediate state change to "uploading",
    // because "updating" in UI state takes a second or two
    setTimeout(() => {
      setUploading(false)
    }, 1000)
  }

  function previewImage(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      field.value = reader.result
      imageNodeRef.current.src = reader.result
    }
  }

  function fileChangeHandler(e) {
    uploadImage(e.target.files[0])
  }

  function dragEnterHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('text/html')) {
      return
    }
    setDraggedOver(true)
  }

  function dragOverHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('text/html')) {
      return
    }
    setDraggedOver(true)
  }

  function dragLeaveHandler(e) {
    e.preventDefault()
    setDraggedOver(false)
  }

  function dropHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('text/html')) {
      return
    }
    setDraggedOver(false)
    setUploading(true)
    // If we're in settings mode, get out of it
    if (settingsMode) {
      settingsHandler(field.id)
    }
    const dt = e.dataTransfer
    const files = dt.files
    uploadImage(files[0])
  }

  const formClasses = cx({
    'document-field__drop-area': true,
    'document-field__drop-area--with-value': field.value,
    'document-field__drop-area--active': draggedOver,
    'document-field__drop-area--uploading': updating
  })

  return (
    <div className="document-field__image">
      <div className="document-field__image-container">
        {field.value &&
        <img src={field.value} alt={field.name} ref={imageNodeRef} />
        }
        {(uploading || updating) &&
        <div className="document-field__progress">
          <SpinnerComponent color="#ffffff" width="36" height="36" />
        </div>
        }
      </div>
      {(settingsMode || !field.value) &&
      <form
        className={formClasses}
        onDragEnter={dragEnterHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        onDrop={dropHandler}>
        {!updating &&
        <label>
          <p>Drag and drop an image</p>
          <span className="btn btn--small">Or select a file</span>
          <input hidden type="file" accept="image/*" onChange={fileChangeHandler} />
          <br />
          {settingsMode &&
          <button className="btn btn--blank" onClick={(e) => { e.preventDefault(); settingsHandler(field.id) }}>Cancel</button>
          }
          {warning &&
          <p className="small warning">{warning}</p>
          }
        </label>
        }
      </form>
      }
    </div>
  )
}

FieldImageComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
}

export default FieldImageComponent
