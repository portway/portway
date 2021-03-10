import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { debounce } from 'Shared/utilities'

import './FieldImageSettings.scss'

const FieldImageSettings = ({ field, onRename, updateSettingsHandler, visible }) => {
  const FIELD_IMAGE_ALIGNMENT = {
    CENTER: 'center',
    LEFT: 'left',
    RIGHT: 'right'
  }

  // Default to center
  const [alignmentChecked, setAlignmentChecked] = useState(field.alignment ? field.alignment : FIELD_IMAGE_ALIGNMENT.CENTER)
  const [altText, setAltText] = useState(field.alt ? field.alt : undefined)

  const fieldSettingsClasses = cx({
    'field-image-settings': true,
    'field-image-settings--visible': visible,
  })

  const submitSettings = debounce(500, () => {
    updateSettingsHandler({ alignment: alignmentChecked, alt: altText })
  })

  function handleAlignmentChange(value) {
    setAlignmentChecked(value)
    submitSettings()
  }

  function handleAltTextChange(e) {
    setAltText(e.target.value)
    submitSettings()
  }

  return (
    <div className={fieldSettingsClasses} aria-hidden={!visible}>
      <div className="field-settings__field">
        <label>
          Image name
          <input
            defaultValue={field.name}
            onChange={(e) => { onRename(field.id, e.currentTarget.value) }}
            placeholder="Name your image"
            type="text"
          />
        </label>
      </div>
      {/* /field */}
      <div className="field-settings__field">
        <div>
          <b>Alignment</b>
          <div className="field-settings__radiogroup-text-only">
            <input
              id={`alignment-left-${field.id}`}
              type="radio"
              name={`alignment-left-${field.id}`}
              checked={alignmentChecked === FIELD_IMAGE_ALIGNMENT.LEFT}
              onChange={() => {
                handleAlignmentChange(FIELD_IMAGE_ALIGNMENT.LEFT)
              }}
            />
            <label htmlFor={`alignment-left-${field.id}`}>Left</label>
            <input
              id={`alignment-center-${field.id}`}
              type="radio"
              name={`alignment-left-${field.id}`}
              checked={alignmentChecked === FIELD_IMAGE_ALIGNMENT.CENTER}
              onChange={() => {
                handleAlignmentChange(FIELD_IMAGE_ALIGNMENT.CENTER)
              }}
            />
            <label htmlFor={`alignment-center-${field.id}`}>Center</label>
            <input
              id={`alignment-right-${field.id}`}
              type="radio"
              name={`alignment-left-${field.id}`}
              checked={alignmentChecked === FIELD_IMAGE_ALIGNMENT.RIGHT}
              onChange={() => {
                handleAlignmentChange(FIELD_IMAGE_ALIGNMENT.RIGHT)
              }}
            />
            <label htmlFor={`alignment-right-${field.id}`}>Right</label>
          </div>
        </div>
      </div>
      {/* /field */}
      <div className="field-settings__field">
        <label>
          Alt text
          <input
            placeholder="Alt tag text"
            type="text"
            value={altText}
            onChange={handleAltTextChange}
          />
        </label>
      </div>
      {/* /field */}
    </div>
  )
}

FieldImageSettings.propTypes = {
  field: PropTypes.object.isRequired,
  onRename: PropTypes.func.isRequired,
  updateSettingsHandler: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default FieldImageSettings
