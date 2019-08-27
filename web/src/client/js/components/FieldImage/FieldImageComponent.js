import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import SpinnerComponent from 'Components/Spinner/SpinnerComponent'
import { MAX_FILE_SIZE } from 'Shared/constants'
import './FieldImage.scss'

const ALLOWED_TYPES = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
  "image/x-icon",
]

const FieldImageComponent = ({ field, onChange }) => {
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
    setUploading(true)
    previewImage(file)
  }

  function previewImage(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      const image = document.createElement('img')
      image.src = reader.result
      imageNodeRef.current.appendChild(image)
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
    const dt = e.dataTransfer
    const files = dt.files
    uploadImage(files[0])
  }

  const formClasses = cx({
    'document-field__drop-area': true,
    'document-field__drop-area--active': draggedOver,
    'document-field__drop-area--uploading': uploading
  })

  return (
    <div className="document-field__image">
      <form
        className={formClasses}
        onDragEnter={dragEnterHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        onDrop={dropHandler}>
        {!uploading &&
        <label>
          <p>Drag and drop an image</p>
          <span className="btn btn--small">Or select a file</span>
          <input hidden type="file" accept="image/*" onChange={fileChangeHandler} defaultValue={field.value} />
          {warning &&
          <p className="small warning">{warning}</p>
          }
        </label>
        }
        {uploading &&
        <div className="document-field__progress">
          <div className="document-field__preview-image" ref={imageNodeRef} />
          <SpinnerComponent color="#ffffff" width="36" height="36" />
        </div>
        }
      </form>
    </div>
  )
}

FieldImageComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FieldImageComponent
