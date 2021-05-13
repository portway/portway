import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import useIsMounted from 'Hooks/useIsMounted'
import usePrevious from 'Hooks/usePrevious'

import { IMAGE_ALLOWED_TYPES, MAX_FIELD_NAME_SIZE, MAX_FILE_SIZE_BYTES } from 'Shared/constants'
import { FieldSettingsIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'

import FileUploaderComponent from 'Components/FileUploader/FileUploaderComponent'

import IconImage from '../../../images/icon/image.svg'
import './FieldImage.scss'

const FieldImageComponent = ({
  autoFocusElement,
  field,
  onChange,
  onRename,
  onFocus,
  onBlur,
  readOnly,
  settingsHandler,
  updating,
  isCurrentlyFocusedField,
  isBeingRemotelyEdited,
  documentId
}) => {
  const isMounted = useIsMounted()
  const [warning, setWarning] = useState(null)
  const isReadOnly = isBeingRemotelyEdited || readOnly

  // Previews
  const previewRef = useRef() // the File data

  // Image
  const imageNodeRef = useRef() // the actual <img /> tag
  const [imageSrc, setImageSrc] = useState(field.value || IconImage)
  const isUpdatingTheActualImage = updating && previewRef.current
  const nameRef = useRef()
  const previousField = usePrevious(field)

  // // Use the formats if we have them
  const originalSource = useRef(field.formats && field.formats.original)
  const webpSource = useRef(field.formats && field.formats.webp)

  // Name
  // There was a field name change and we're not currently focused, update the uncontrolled value
  if (nameRef.current && field.name !== nameRef.current && !isCurrentlyFocusedField && field !== previousField) {
    nameRef.current.value = field.name
  }

  // if the image is updated in the settings panel, webp will be wiped out until the image can process in the background
  // in these cases, formats will be undefined and we want the component to reflect that
  useEffect(() => {
    originalSource.current = field.formats && field.formats.original
    webpSource.current = field.formats && field.formats.webp
  }, [field.formats])

  useEffect(() => {
    setImageSrc(field.value || IconImage)
  }, [field.value])

  useEffect(() => {
    // When the image src is updating, render a preview of the image with the
    // new details
    if (isUpdatingTheActualImage) {
      const reader = new FileReader()
      reader.readAsDataURL(previewRef.current)
      reader.onload = (e) => {
        if (isMounted.current) {
          // Reset all stored image values, and show the preview
          imageNodeRef.current.setAttribute('srcset', '')
          originalSource.current = null
          webpSource.current = null
          setImageSrc(e.target.result)
        }
      }
    }
  }, [isMounted, isUpdatingTheActualImage, previewRef])

  function internalSettingsFocusHandler(fieldId, fieldType) {
    if (!isReadOnly) {
      settingsHandler(fieldId)
    }
  }

  function uploadImage(file) {
    setWarning(null)
    if (file.size >= MAX_FILE_SIZE_BYTES) {
      setWarning(`Your image must be less than ${MAX_FILE_SIZE_BYTES / 10e5}MB.`)
      return
    }
    if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
      setWarning(`Sorry, the image type “${file.type}” is not supported. Try a jpg, png, or webp!`)
      return
    }
    // Save the file for previewing AFTER updating starts
    // This fixes the display bug where the image was previewed before it started
    // uploading, so it was weird
    previewRef.current = file
    // Start the uploading
    const formData = new FormData()
    formData.append('file', file)
    // If this is a new, empty image, set its name to the filename, but no greater
    // than MAX_FIELD_NAME_SIZE
    if (!field.value) {
      formData.append('name', file.name.substring(0, MAX_FIELD_NAME_SIZE - 1))
    }
    onChange(field.id, formData)
  }

  const imageFieldClassNames = cx({
    'document-field__image': true,
    'document-field__image--empty': !field.value,
  })

  const imageClassnames = cx({
    'document-field__image-tag': true,
    'document-field__image-tag--empty': !field.value,
  })

  const containerClassnames = cx({
    'document-field__image-container': true,
    'document-field__image-container--empty': !field.value,
  })

  return (
    <figure className={imageFieldClassNames}>
      <div className={containerClassnames}>
        {imageSrc &&
        <picture>
          {webpSource.current &&
          <source type="image/webp" srcSet={`${webpSource.current.half}, ${webpSource.current.full} 2x`} />
          }
          {originalSource.current &&
          <source type="<JJ_HERE>" srcSet={`${originalSource.current.half}, ${originalSource.current.full} 2x`} />
          }
          <img
            alt={field && field.name}
            className={imageClassnames}
            height={field.meta && field.meta.height}
            lazy="true"
            ref={imageNodeRef}
            src={imageSrc}
            width={field.meta && field.meta.width}
          />
        </picture>
        }
        <FileUploaderComponent
          accept="image/*"
          hasValue={field.value !== null}
          invisible={field.value !== null}
          isUpdating={updating}
          label="Drag and drop an image"
          fileChangeHandler={uploadImage}
          clickHandler={() => { onFocus(field.id, field.type, documentId) }}
          blurHandler={() => { onBlur(field.id, field.type, documentId )}}>
        </FileUploaderComponent>
      </div>
      <div className="document-field__settings-button">
        {!readOnly && field.value &&
        <IconButton color="dark" className="document-field__edit-btn" aria-label="Configure image" onClick={() => { internalSettingsFocusHandler(field.id, field.type) }}>
          <FieldSettingsIcon width="14" height="14" />
        </IconButton>
        }
      </div>
      {warning &&
      <p className="small warning">{warning}</p>
      }
    </figure>
  )
}

FieldImageComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onRename: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  isCurrentlyFocusedField: PropTypes.bool,
  isBeingRemotelyEdited: PropTypes.bool,
  documentId: PropTypes.number
}

FieldImageComponent.defaultProps = {
  updating: false,
}

export default FieldImageComponent
