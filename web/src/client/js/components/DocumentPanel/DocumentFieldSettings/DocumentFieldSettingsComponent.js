import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { FIELD_TYPES, FILES_DISALLOWED_EXTENSIONS, IMAGE_ALLOWED_TYPES, MAX_FILE_SIZE_BYTES } from 'Shared/constants'
import { getFileExtension, humanFileSize } from 'Utilities/fileUtilities'
import { FileIcon } from 'Components/Icons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const FIELD_IMAGE_ALIGNMENT = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right'
}

const FIELD_UPDATE_TYPES = {
  IMAGE: 'IMAGE',
}

const DocumentFieldSettingsComponent = ({ field, isUpdating, updateHandler }) => {
  const [warning, setWarning] = useState()
  const [alignmentChecked, setAlignmentChecked] = useState(field.alignment ? field.alignment : FIELD_IMAGE_ALIGNMENT.CENTER)
  const updatingFieldType = useRef()

  function handleAlignmentChange(value) {
    updatingFieldType.current = null
    setAlignmentChecked(value)
    updateHandler({ alignment: value })
  }

  function handleFileUpload(e) {
    setWarning(null)
    updatingFieldType.current = FIELD_UPDATE_TYPES.IMAGE
    const data = e.target.files
    const file = Array.from(data)[0]
    const extension = getFileExtension(file.name)

    if (file.size >= MAX_FILE_SIZE_BYTES) {
      setWarning(`Your image must be less than ${MAX_FILE_SIZE_BYTES / 10e5}MB.`)
      return
    }

    if (field.type === FIELD_TYPES.IMAGE && !IMAGE_ALLOWED_TYPES.includes(file.type)) {
      setWarning(`Sorry, the image type “${file.type}” is not supported. Try a jpg, png, or webp!`)
      return
    }

    if (field.type === FIELD_TYPES.FILE && FILES_DISALLOWED_EXTENSIONS.includes(extension)) {
      setWarning(`This type of file is not supported.`)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    updateHandler({ value: formData })
  }

  // Default should be FILE if there isn't a file to get an extension from
  const fileExtension = field.meta ? getFileExtension(field.meta.originalName) : 'FILE'

  return (
    <div className="document-field-settings">

      {field.type === FIELD_TYPES.IMAGE && field.value &&
      <a className="document-panel__image-link" href={field.value} target="_blank" rel="noopener noreferrer">
        <picture>
          {field.formats && field.formats.webp && field.formats.original.mimeType !== 'image/svg+xml' &&
          <source type="image/webp" srcSet={`${field.formats.webp.half}, ${field.formats.webp.full} 2x`} />
          }
          {field.formats && field.formats.original && field.formats.original.mimeType !== 'image/svg+xml' &&
          <source type={field.formats.original.mimeType} srcSet={`${field.formats.original.half}, ${field.formats.original.full} 2x`} />
          }
          <img src={field.value} width={field.meta && field.meta.width} height={field.meta && field.meta.height} alt={field.alt && field.alt} />
        </picture>
      </a>
      }

      {field.type === FIELD_TYPES.FILE &&
      <div className="document-panel__file-info">
        <FileIcon width="36" height="36" extension={fileExtension.toUpperCase()} />
        {field.value &&
        <span><a href={field.value} download>Download</a> {field.meta && field.meta.size && <>({humanFileSize(field.meta.size, true)})</>}</span>
        }
        {!field.value &&
        <span><em>No file set</em></span>
        }
      </div>
      }

      <dl>
        {field.type === FIELD_TYPES.IMAGE && field.meta && field.meta.width && field.meta.height &&
        <>
          <dt>Dimensions</dt>
          <dd className="document-panel__definiton-list-divider--bottom">{field.meta.width}x{field.meta.height}</dd>
        </>
        }

        <dt>
          <label htmlFor="field-name">Name</label>
        </dt>
        <dd>
          <input
            className="document-panel__input"
            value={field.name}
            id="field-name"
            onChange={(e) => {
              updatingFieldType.current = null
              updateHandler({ name: e.target.value })
            }}
            placeholder="Enter a field name"
          />
        </dd>

        {field.type === FIELD_TYPES.IMAGE &&
        <>
          <dt>
            <label htmlFor="field-alt">Alt text</label>
          </dt>
          <dd>
            <input
              className="document-panel__input"
              defaultValue={field.alt ? field.alt : null}
              id="field-alt"
              onChange={(e) => {
                updatingFieldType.current = null
                updateHandler({ alt: e.target.value })
              }}
              placeholder="Enter alt text"
            />
          </dd>
          <dt>
            Alignment
          </dt>
          <dd>
            <div className="document-panel__radiogroup-text-only">
              <input
                id={`alignment-left-${field.id}`}
                type="radio"
                checked={alignmentChecked === FIELD_IMAGE_ALIGNMENT.LEFT}
                onChange={() => {
                  handleAlignmentChange(FIELD_IMAGE_ALIGNMENT.LEFT)
                }}
              />
              <label htmlFor={`alignment-left-${field.id}`}>Left</label>
              <input
                id={`alignment-center-${field.id}`}
                type="radio"
                checked={alignmentChecked === FIELD_IMAGE_ALIGNMENT.CENTER}
                onChange={() => {
                  handleAlignmentChange(FIELD_IMAGE_ALIGNMENT.CENTER)
                }}
              />
              <label htmlFor={`alignment-center-${field.id}`}>Center</label>
              <input
                id={`alignment-right-${field.id}`}
                type="radio"
                checked={alignmentChecked === FIELD_IMAGE_ALIGNMENT.RIGHT}
                onChange={() => {
                  handleAlignmentChange(FIELD_IMAGE_ALIGNMENT.RIGHT)
                }}
              />
              <label htmlFor={`alignment-right-${field.id}`}>Right</label>
            </div>
          </dd>
        </>
        }

        {(field.type === FIELD_TYPES.IMAGE || field.type === FIELD_TYPES.FILE) &&
        <>
        <dt>Value</dt>
        <dd>
          {isUpdating && updatingFieldType.current === FIELD_UPDATE_TYPES.IMAGE &&
          <div className="document-panel__row">
            <SpinnerComponent message="Uploading image..." width="14" height="14" />
            <span className="note">Uploading image</span>
          </div>
          }
          <input
            className="document-panel__input document-panel__input--file"
            type="file"
            onChange={handleFileUpload}
          />
          {warning &&
          <div className="small warning">{warning}</div>
          }
        </dd>
        </>
        }

        <dt className="document-panel__definiton-list-divider--top">Last update</dt>
        <dd>{moment(field.updatedAt).fromNow()}</dd>
        <dt>Created on</dt>
        <dd>{moment(field.createdAt).format('MMMM do, YYYY - h:mma')}</dd>
      </dl>
    </div>
  )
}

DocumentFieldSettingsComponent.propTypes = {
  field: PropTypes.object,
  isUpdating: PropTypes.bool,
  updateHandler: PropTypes.func.isRequired,
}

export default DocumentFieldSettingsComponent
