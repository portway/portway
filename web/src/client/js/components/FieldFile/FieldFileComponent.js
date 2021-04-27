import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { FILES_DISALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from 'Shared/constants'
import { FieldSettingsIcon, FileIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'
import { getFileExtension, humanFileSize } from 'Utilities/fileUtilities'
import FileUploaderComponent from 'Components/FileUploader/FileUploaderComponent'

import './FieldFile.scss'

const FieldFileComponent = ({
  field,
  onChange,
  onFocus,
  onBlur,
  readOnly,
  settingsHandler,
  updating,
  isBeingRemotelyEdited,
  documentId
}) => {
  const [warning, setWarning] = useState(null)
  const isReadOnly = isBeingRemotelyEdited || readOnly

  function uploadFile(file) {
    setWarning(null)
    const extension = getFileExtension(file.name)
    if (file.size >= MAX_FILE_SIZE_BYTES) {
      setWarning(`Your file must be less than ${MAX_FILE_SIZE_BYTES / 10e5}MB.`)
      return
    }
    if (FILES_DISALLOWED_EXTENSIONS.includes(extension)) {
      setWarning(`This type of file is not supported.`)
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    if (!field.value) {
      formData.append('name', file.name)
    }
    onChange(field.id, formData)
  }

  function internalSettingsFocusHandler(fieldId) {
    if (!isReadOnly) {
      settingsHandler(fieldId)
    }
  }

  const fileClassNames = cx({
    'document-field__file-value': true,
    'document-field__file-value--empty': !field.value
  })

  const fileExtension = field.meta ? getFileExtension(field.meta.originalName) : null

  return (
    <div className="document-field__file">
      <div className="document-field__file-container">
        <div className={fileClassNames}>
          {field.value && field.meta && (
            <>
              <FileIcon width="36" height="36" extension={fileExtension.toUpperCase()} />
              <a href={field.value} target="_blank" rel="noopener noreferrer">
                {field.meta.originalName}
              </a>
              <span className="document-field__file-meta">
                (Size: {humanFileSize(field.meta.size, true)})
              </span>
              {!readOnly && (
                <IconButton
                  className="document-field__edit-btn"
                  aria-label="Change file"
                  onClick={() => {
                    internalSettingsFocusHandler(field.id)
                  }}>
                  <FieldSettingsIcon width="14" height="14" />
                </IconButton>
              )}
            </>
          )}
          {(!field.value) && !warning && (
            <FileUploaderComponent
              hasValue={field.value !== null}
              isUpdating={updating}
              label="Drag and drop a file"
              fileChangeHandler={uploadFile}
              fileUploadedHandler={() => {
                settingsHandler(field.id)
              }}
            />
          )}
          {warning && <p className="small warning">{warning}</p>}
        </div>
      </div>
    </div>
  )
}

FieldFileComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  isBeingRemotelyEdited: PropTypes.bool,
  documentId: PropTypes.number
}

FieldFileComponent.defaultProps = {
  updating: false,
}

export default FieldFileComponent
