import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { FIELD_TYPES } from 'Shared/constants'

import './_DocumentField.scss'
import './_DocumentTools.scss'

// Fields that are of the "data" type in the content menu
// These get the name, and white box around them
const DATA_FIELD_TYPES = [
  FIELD_TYPES.DATE,
  FIELD_TYPES.FILE,
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.STRING,
]

const DocumentFieldComponent = ({
  children,
  field,
  index,
  isNewField,
  isUpdating,
  onRename,
  readOnly,
  settingsMode,
}) => {
  const nameRef = useRef()
  useEffect(() => {
    if (isNewField && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: 'smooth' })
      nameRef.current.focus()
    }
  }, [isNewField])

  const dataField = DATA_FIELD_TYPES.includes(field.type)

  const fieldClasses = cx({
    'document-field': true,
    'document-field--new': isNewField,
    'document-field--data': dataField,
    'document-field--text': field.type === FIELD_TYPES.TEXT,
    'document-field--number': field.type === FIELD_TYPES.NUMBER,
    'document-field--string': field.type === FIELD_TYPES.STRING,
    'document-field--image': field.type === FIELD_TYPES.IMAGE,
    'document-field--file': field.type === FIELD_TYPES.FILE,
    'document-field--settings-mode': settingsMode,
  })

  const fieldToolClasses = cx({
    'document-field__tools': true,
  })

  const fieldActionClasses = cx({
    'document-field__actions': true,
  })

  const fieldContainerClasses = cx({
    'document-field__container': true,
  })

  const fieldLabels = {
    [FIELD_TYPES.TEXT]: 'Text area',
    [FIELD_TYPES.STRING]: 'String',
    [FIELD_TYPES.NUMBER]: 'Number',
    [FIELD_TYPES.IMAGE]: 'Image',
    [FIELD_TYPES.DATE]: 'Date',
    [FIELD_TYPES.FILE]: 'File'
  }

  // Field name handling
  const fieldLengthFactor = 6.5
  const fieldNameMaxLength = 50
  const fieldMinimumWidth = 150 // this is set as a var in _DocumentField.scss as well
  function returnInitialNameLength(length) {
    if (length > fieldNameMaxLength) {
      return
    }
    return length * fieldLengthFactor > fieldMinimumWidth ? length * fieldLengthFactor : fieldMinimumWidth
  }

  return (
    <li
      className={fieldClasses}
      data-id={field.id}
      data-order={index}
    >
      <div className="document-field__component">

        <div className={fieldToolClasses}></div>

        <div className={fieldContainerClasses}>

          {dataField &&
          <div className="document-field__name">
            <span className="document-field__name-label">{fieldLabels[field.type]}</span>
            <input
              defaultValue={field.name}
              maxLength={fieldNameMaxLength}
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === 'escape') {
                  e.target.blur()
                  return
                }
                e.target.style.width = `${returnInitialNameLength(e.target.value.length + 1)}px`
              }}
              onChange={(e) => { onRename(field.id, e.target.value) }}
              onFocus={(e) => {
                if (!readOnly) {
                  e.target.select()
                }
              }}
              readOnly={readOnly}
              ref={nameRef}
              style={{ width: returnInitialNameLength(field.name.length) + 'px' }}
              type="text" />
          </div>
          }

          <div className="document-field__content">
            {children}
          </div>

        </div>

        <div className={fieldActionClasses}></div>

      </div>
    </li>
  )
}

DocumentFieldComponent.propTypes = {
  children: PropTypes.element.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isNewField: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool,
  onRename: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsMode: PropTypes.bool.isRequired,
}

export default DocumentFieldComponent
