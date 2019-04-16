import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { debounce } from 'Shared/utilities'
import Constants from 'Shared/constants'
import { RemoveIcon } from 'Components/Icons'

import './DocumentField.scss'

const DocumentFieldComponent = ({ children, field, showName, onDestroy, onRename }) => {
  // field name change
  const nameRef = useRef()
  const debouncedNameChangeHandler = debounce(1000, (e) => {
    onRename(field.id, { name: nameRef.current.value })
  })
  const fieldClasses = cx({
    'field': true,
    'field--text': field.type === Constants.FIELD_TYPES.TEXT,
    'field--number': field.type === Constants.FIELD_TYPES.NUMBER,
    'field--string': field.type === Constants.FIELD_TYPES.STRING,
  })
  return (
    <div className={fieldClasses}>
      <div className="field__component">
        {children}
        {showName &&
        <input
          ref={nameRef}
          className="field__name"
          defaultValue={field.name}
          onChange={debouncedNameChangeHandler}
          onFocus={(e) => { e.target.select() }}
          type="text" />
        }
      </div>
      {onDestroy &&
      <button className="btn btn--blank btn--with-circular-icon" onClick={onDestroy}>
        <RemoveIcon />
      </button>
      }
    </div>
  )
}

DocumentFieldComponent.propTypes = {
  children: PropTypes.element.isRequired,
  field: PropTypes.object.isRequired,
  showName: PropTypes.bool.isRequired,
  onDestroy: PropTypes.func,
  onRename: PropTypes.func.isRequired
}

export default DocumentFieldComponent
