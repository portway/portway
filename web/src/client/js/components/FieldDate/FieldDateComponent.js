import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import { DateIcon, TimeIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'

import './react-datepicker.css'
import './_FieldDateStyles.scss'

// eslint-disable-next-line react/display-name, react/prop-types
const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className="document-field__date-input-container" ref={ref}>
    <div className="document-field__date-button">
      <IconButton aria-label="Change the date" onClick={onClick}>
        <DateIcon width="14" height="14" />
      </IconButton>
    </div>
    {moment(value).format('dddd MMMM Do, YYYY')}
  </div>
))

// eslint-disable-next-line react/display-name, react/prop-types
const CustomTimeInput = forwardRef(({ value, onClick }, ref) => (
  <div className="document-field__date-input-container" ref={ref}>
    <div className="document-field__date-button">
      <IconButton aria-label="Change the date" onClick={onClick}>
        <TimeIcon width="14" height="14" />
      </IconButton>
    </div>
    {moment(value).format('h:mm a')}
  </div>
))

const FieldDateComponent = ({
  field,
  onBlur,
  onChange,
  onFocus,
  readOnly
}) => {
  const hasDate = field && field.value
  const [fieldDate, setFieldDate] = useState(new Date(hasDate))

  function internalChangeHandler(date) {
    setFieldDate(date)
    onChange(field.id, date)
  }

  return (
    <div className="document-field__date">
      <DatePicker
        customInput={<CustomDateInput />}
        dateFormat="yyyy-MM-dd hh:mm:ss"
        onChange={internalChangeHandler}
        popperPlacement="top-start"
        popperModifiers={{
          flip: {
            enabled: false
          },
          preventOverflow: {
            enabled: true,
            escapeWithReference: true, // force popper to stay in viewport (even when input is scrolled out of view)
            boundariesElement: 'viewport'
          }
        }}
        selected={fieldDate}
      />
      <DatePicker
        customInput={<CustomTimeInput />}
        dateFormat="yyyy-MM-dd hh:mm:ss"
        onChange={internalChangeHandler}
        selected={fieldDate}
        showTimeSelect
        showTimeSelectOnly
        timeCaption="Time"
        timeIntervals={15}
      />
    </div>
  )
}

FieldDateComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldDateComponent
