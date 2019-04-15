import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import { RemoveIcon } from 'Components/Icons'

const DocumentFieldComponent = ({ children, type, onDestroy }) => {
  const fieldClasses = cx({
    'field': true,
    'field--text': type === Constants.FIELD_TYPES.TEXT
  })
  return (
    <div className={fieldClasses}>
      <div className="field__component">
        {children}
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
  type: PropTypes.number.isRequired,
  onDestroy: PropTypes.func
}

export default DocumentFieldComponent
