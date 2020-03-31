import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import useIsMounted from 'Hooks/useIsMounted'

import { MAX_FILE_SIZE } from 'Shared/constants'
import { RemoveIcon, EditIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'
import FileUploaderComponent from 'Components/FileUploader/FileUploaderComponent'

import IconImage from '../../../images/icon/image.svg'
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
  autoFocusElement,
  field,
  onChange,
  onRename,
  readOnly,
  settingsHandler,
  settingsMode,
  updating
}) => {
  const isMounted = useIsMounted()
  const [warning, setWarning] = useState(null)

  // Previews
  const previewRef = useRef() // the File data

  // Image
  const imageRef = useRef() // temporary image to do width/height
  const imageNodeRef = useRef() // the actual <img /> tag
  const [imageSrc, setImageSrc] = useState(field.value || IconImage) // the source of the image
  const [imageDetails, setImageDetails] = useState({}) // image metadata
  const isUpdatingTheActualImage = settingsMode && updating && previewRef.current
  const nameRef = useRef()

  useEffect(() => {
    // If the source of the image changes (field.value), let's create a new
    // image to get its size and dimensions
    if (field.value) {
      imageRef.current = new Image()
      imageRef.current.src = field.value
      imageRef.current.onload = () => {
        if (isMounted.current) {
          nameRef.current.value = field.name
          setImageDetails({
            height: imageRef.current.naturalHeight,
            width: imageRef.current.naturalWidth,
          })
        }
      }
    }
  }, [isMounted, field.value, field.name])

  useEffect(() => {
    // When the image src is updating, render a preview of the image with the
    // new details
    if (isUpdatingTheActualImage) {
      const reader = new FileReader()
      reader.readAsDataURL(previewRef.current)
      reader.onload = (e) => {
        imageRef.current = new Image()
        imageRef.current.src = e.target.result
        imageRef.current.onload = () => {
          if (isMounted.current) {
            setImageSrc(e.target.result)
            // Updating the preview
            setImageDetails({
              height: imageRef.current.naturalHeight,
              width: imageRef.current.naturalWidth,
            })
          }
        }
      }
    }
  }, [isMounted, isUpdatingTheActualImage, previewRef])

  function uploadImage(file) {
    setWarning(null)
    if (file.size >= MAX_FILE_SIZE) {
      setWarning(`Your image must be less than ${MAX_FILE_SIZE / 100}MB.`)
      settingsHandler(field.id)
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setWarning(`Sorry, the image type “${file.type}” is not supported. Try a jpg, png, or gif!`)
      settingsHandler(field.id)
      return
    }
    // Save the file for previewing AFTER updating starts
    // This fixes the display bug where the image was previewed before it started
    // uploading, so it was weird
    previewRef.current = file
    nameRef.current.blur()
    // Start the uploading
    const formData = new FormData()
    formData.append('file', file)
    if (!field.value) {
      formData.append('name', file.name)
    }
    onChange(field.id, formData)
  }

  const imageClassnames = cx({
    'document-field__image-tag': true,
    'document-field__image-tag--empty': !field.value,
  })

  return (
    <div className="document-field__image">
      <figure className="document-field__image-figure">
        <div className="document-field__image-container">
          {imageSrc &&
          <img
            className={imageClassnames}
            src={imageSrc}
            alt={field && field.name}
            ref={imageNodeRef}
            lazy="true"
          />
          }
          <div className="document-field__settings-button">
            <>
              {!settingsMode && !readOnly && field.value &&
                <IconButton color="dark" className="document-field__edit-btn" aria-label="Change image" onClick={() => { settingsHandler(field.id) }}>
                  <EditIcon width="14" height="14" />
                </IconButton>
              }
              {settingsMode && field.value &&
                <IconButton color="dark" aria-label="Exit settings" onClick={() => { settingsHandler(field.id) }}>
                  <RemoveIcon width="12" height="12" />
                </IconButton>
              }
            </>
          </div>
          {(settingsMode || !field.value || isUpdatingTheActualImage) &&
          <FileUploaderComponent
            accept="image/*"
            hasValue={field.value !== null}
            isUpdating={updating}
            label="Drag and drop an image"
            fileChangeHandler={uploadImage}
            fileUploadedHandler={() => { settingsHandler(field.id) }}>
          </FileUploaderComponent>
          }
        </div>
        <figcaption className="document-field__image-details">
          <ul className="list list--blank">
            <li className="document-field__image-details">
              <input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={autoFocusElement}
                className="input--without-styling"
                defaultValue={field.name}
                onChange={(e) => { onRename(field.id, e.currentTarget.value) }}
                placeholder="Name your image"
                ref={nameRef}
                type="text"
              />
            </li>
            {imageDetails && imageDetails.width && imageDetails.height &&
            <li className="document-field__image-details document-field__image-details--meta">
              {`${imageDetails.width}x${imageDetails.height}`}
            </li>
            }
          </ul>
          {warning &&
          <p className="small warning">{warning}</p>
          }
        </figcaption>
      </figure>
    </div>
  )
}

FieldImageComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
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
