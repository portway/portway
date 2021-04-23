import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { FIELD_TYPES, MAX_FILE_SIZE } from 'Shared/constants'

const FIELD_IMAGE_ALIGNMENT = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right'
}

const DocumentFieldSettingsComponent = ({ field, updateHandler }) => {
  const [warning, setWarning] = useState()
  const [alignmentChecked, setAlignmentChecked] = useState(field.alignment ? field.alignment : FIELD_IMAGE_ALIGNMENT.CENTER)

  function handleAlignmentChange(value) {
    setAlignmentChecked(value)
    updateHandler({ alignment: value })
  }

  return (
    <div className="document-field-settings">
      {field.type === FIELD_TYPES.IMAGE &&
      <a href={field.value} target="_blank" rel="noopener noreferrer">
        <img src={field.value} width={field.meta.width} height={field.meta.height} alt={field.alt} />
      </a>
      }
      <dl>
        {field.type === FIELD_TYPES.IMAGE &&
        <>
          <dt>Dimensions</dt>
          <dd>{field.meta.width}x{field.meta.height}</dd>
        </>
        }

        <dt>
          <label htmlFor="field-name">Name</label>
        </dt>
        <dd>
          <input
            className="document-panel__input"
            defaultValue={field.name}
            id="field-name"
            onChange={(e) => {
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
              defaultValue={field.alt}
              id="field-alt"
              onChange={(e) => {
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
          <input
            className="document-panel__input document-panel__input--file"
            type="file"
            onChange={(e) => {
              const data = e.target.files
              const files = Array.from(data)

              if (files[0].size >= MAX_FILE_SIZE) {
                setWarning(`File size must be less than ${MAX_FILE_SIZE / 1000}K`)
                return
              }

              const formData = new FormData()
              formData.append('value', files[0])
              updateHandler(formData)
            }}
          />
          {warning &&
          <p className="small warning">{warning}</p>
          }
        </dd>
        </>
        }

        <dt>Last update</dt>
        <dd>{moment(field.updatedAt).fromNow()}</dd>
        <dt>Created on</dt>
        <dd>{moment(field.createdAt).format('MMMM do, YYYY - h:mma')}</dd>
      </dl>
    </div>
  )
}

DocumentFieldSettingsComponent.propTypes = {
  field: PropTypes.object,
  updateHandler: PropTypes.func.isRequired,
}

export default DocumentFieldSettingsComponent
