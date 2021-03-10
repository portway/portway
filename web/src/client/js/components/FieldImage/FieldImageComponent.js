import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import useIsMounted from 'Hooks/useIsMounted'
import usePrevious from 'Hooks/usePrevious'

import { MAX_FIELD_NAME_SIZE, MAX_FILE_SIZE } from 'Shared/constants'
import { CheckIcon, EditIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'

import FieldImageSettings from './FieldImageSettings'
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
  onFocus,
  onBlur,
  readOnly,
  settingsHandler,
  settingsMode,
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
  const imageSrc = field.value || IconImage // the source of the image
  const isUpdatingTheActualImage = updating && previewRef.current
  const nameRef = useRef()
  const previousField = usePrevious(field)

  // Use the formats if we have them
  const webpSource = field.formats && field.formats.webp

  // Name
  // There was a field name change and we're not currently focused, update the uncontrolled value
  if (nameRef.current && field.name !== nameRef.current && !isCurrentlyFocusedField && field !== previousField) {
    nameRef.current.value = field.name
  }

  useEffect(() => {
    // When the image src is updating, render a preview of the image with the
    // new details
    if (isUpdatingTheActualImage) {
      const reader = new FileReader()
      reader.readAsDataURL(previewRef.current)
      reader.onload = (e) => {
        if (isMounted.current) {
          imageNodeRef.current.setAttribute('srcset', e.target.result)
          imageNodeRef.current.setAttribute('src', e.target.result)
        }
      }
    }
  }, [isMounted, isUpdatingTheActualImage, previewRef])

  function internalSettingsFocusHandler(fieldId, fieldType) {
    if (!isReadOnly) {
      settingsHandler(fieldId)
      onFocus(fieldId, fieldType, documentId)
    }
  }

  function internalSettingsBlurHandler(fieldId, fieldType) {
    settingsHandler(fieldId)
    onBlur(fieldId, fieldType, documentId)
  }

  function updateSettingsHandler(settings) {
    const formData = new FormData()
    formData.append('alignment', settings.alignment)
    formData.append('alt', settings.alt)
    onChange(field.id, formData)
  }

  function uploadImage(file) {
    setWarning(null)
    if (file.size >= MAX_FILE_SIZE) {
      setWarning(`Your image must be less than ${MAX_FILE_SIZE / 100}MB.`)
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
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
    'document-field__image--settings-mode': settingsMode,
  })

  const imageClassnames = cx({
    'document-field__image-tag': true,
    'document-field__image-tag--empty': !field.value,
  })

  const containerClassnames = cx({
    'document-field__image-container': true,
    'document-field__image-container--settings-mode': settingsMode,
  })

  return (
    <figure className={imageFieldClassNames}>
      <div className={containerClassnames}>
        {imageSrc &&
        <img
          alt={field && field.name}
          className={imageClassnames}
          height={field.meta && field.meta.height}
          lazy="true"
          ref={imageNodeRef}
          src={webpSource ? webpSource.half : imageSrc}
          srcSet={webpSource ? `${webpSource.half}, ${webpSource.full} 2x` : ``}
          width={field.meta && field.meta.width}
        />
        }
        <FileUploaderComponent
          accept="image/*"
          hasValue={field.value !== null}
          invisible={!settingsMode && field.value !== null}
          isUpdating={updating}
          label="Drag and drop an image"
          fileChangeHandler={uploadImage}
          clickHandler={() => { onFocus(field.id, field.type, documentId) }}
          blurHandler={() => { onBlur(field.id, field.type, documentId )}}>
        </FileUploaderComponent>
      </div>
      <FieldImageSettings
        field={field}
        onRename={onRename}
        updateSettingsHandler={updateSettingsHandler}
        visible={settingsMode}
      />
      <div className="document-field__settings-button">
        {!settingsMode && !readOnly && field.value &&
        <IconButton color="dark" className="document-field__edit-btn" aria-label="Configure image" onClick={() => { internalSettingsFocusHandler(field.id, field.type) }}>
          <EditIcon width="14" height="14" />
        </IconButton>
        }
        {settingsMode &&
        <IconButton color="dark" className="document-field__save-btn" aria-label="Save settings" onClick={() => { internalSettingsBlurHandler(field.id, field.type) }}>
          <CheckIcon fill="#ffffff" width="12" height="12" />
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
  settingsMode: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  isCurrentlyFocusedField: PropTypes.bool,
  isBeingRemotelyEdited: PropTypes.bool,
  documentId: PropTypes.number
}

FieldImageComponent.defaultProps = {
  updating: false,
}

export default FieldImageComponent
