import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './FieldImageSettings.scss'

const FieldImageSettings = ({ field, onRename, visible }) => {
  const fieldSettingsClasses = cx({
    'field-settings': true,
    'field-settings--visible': visible,
  })

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
            <input id={`alignment-left-${field.id}`} type="radio" name="alignment" value="left" />
            <label htmlFor={`alignment-left-${field.id}`}>Left</label>
            <input id={`alignment-center-${field.id}`} type="radio" name="alignment" value="center" defaultChecked />
            <label htmlFor={`alignment-center-${field.id}`}>Center</label>
            <input id={`alignment-right-${field.id}`} type="radio" name="alignment" value="right" />
            <label htmlFor={`alignment-right-${field.id}`}>Right</label>
          </div>
        </div>
      </div>
      {/* /field */}
      <div className="field-settings__field">
        <label>
          Alt text
          <input placeholder="Alt tag text" type="text" />
        </label>
      </div>
      {/* /field */}
    </div>
  )
}

FieldImageSettings.propTypes = {
  field: PropTypes.object.isRequired,
  onRename: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default FieldImageSettings
