import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { MAX_FILE_SIZE } from 'Shared/constants'
import { EditIcon, FileIcon, RemoveIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'
import { getFileExtension, humanFileSize } from 'Utilities/fileUtilities'
import FileUploaderComponent from 'Components/FileUploader/FileUploaderComponent'

import './FieldFile.scss'

const DISALLOWED_EXTENSIONS = [
  'exe',
]

const FieldFileComponent = ({
  field,
  onChange,
  readOnly,
  settingsHandler,
  settingsMode,
  updating
}) => {
  const [warning, setWarning] = useState(null)

  function uploadFile(file) {
    setWarning(null)
    if (file.size >= MAX_FILE_SIZE) {
      setWarning(`Your file must be less than ${MAX_FILE_SIZE / 100}MB.`)
      return
    }
    if (DISALLOWED_EXTENSIONS.includes(file.type)) {
      setWarning(`The file type "${file.type}" is not supported.`)
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    if (!field.value) {
      formData.append('name', file.name)
    }
    onChange(field.id, formData)
  }

  const fileClassNames = cx({
    'document-field__file-value': true,
    'document-field__file-value--empty': !field.value,
  })

  const fileExtension = field.meta ? getFileExtension(field.meta.originalName) : null

  return (
    <div className="document-field__file">
      <div className="document-field__file-container">
        <div className={fileClassNames}>
          {field.value && field.meta && !settingsMode &&
          <>
            <FileIcon width="36" height="36" extension={fileExtension.toUpperCase()} />
            <a href={field.value} target="_blank" rel="noopener noreferrer">{field.meta.originalName}</a>
            <span className="document-field__file-meta">(Size: {humanFileSize(field.meta.size, true)})</span>
            {!readOnly &&
            <IconButton className="document-field__edit-btn" aria-label="Change file" onClick={() => { settingsHandler(field.id) }}>
              <EditIcon width="14" height="14" />
            </IconButton>
            }
          </>
          }
          {(settingsMode || !field.value) &&
          <FileUploaderComponent
            hasValue={field.value !== null}
            isUpdating={updating}
            label="Drag and drop a file"
            fileChangeHandler={uploadFile}
            fileUploadedHandler={() => {
              // Since we render this uploader if there is no field.value,
              // once the field gets a value it will remove it
              // However, when updating an image, we have to manually remove it
              if (field.value && settingsMode) {
                settingsHandler(field.id)
              }
            }}>
          </FileUploaderComponent>
          }
          {settingsMode &&
          <IconButton aria-label="Cancel editing" onClick={() => { settingsHandler(field.id) }}>
            <RemoveIcon width="12" height="12" />
          </IconButton>
          }
        </div>
      </div>
      {warning &&
      <p className="small warning">{warning}</p>
      }
    </div>
  )
}

FieldFileComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
}

FieldFileComponent.defaultProps = {
  updating: false,
}

export default FieldFileComponent
