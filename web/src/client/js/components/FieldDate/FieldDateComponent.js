import React, { forwardRef, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import { FIELD_TYPES } from 'Shared/constants'
import { DateIcon, TimeIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'
import { Popper } from 'Components/Popper/Popper'

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
  </div>
))

const FieldDateComponent = ({
  id,
  type,
  value,
  onBlur,
  onChange,
  onFocus,
  readOnly,
  isBeingRemotelyEdited
}) => {
  const isReadOnly = isBeingRemotelyEdited || readOnly
  const fieldDate = value ? new Date(value) : new Date()
  const timeRef = useRef()
  const [validity, setValidity] = useState(null)

  function internalChangeHandler(date) {
    onChange(id, date.toISOString())
  }

  function delayedBlurHandler(id, type) {
  // we need to delay the blur event until after the field has successfully changed
  // to prevent useEffect triggers in the parent component
    setTimeout(2000, () => {
      onBlur(id, type)
    })
  }

  function updateTimeForDate(hour, minutes) {
    const newTime = new Date(value)
    newTime.setHours(hour)
    newTime.setMinutes(minutes)
    internalChangeHandler(newTime)
  }

  function setTimeValue(e) {
    const input = e.target
    const validity = input.validity
    if (validity.patternMismatch) {
      // Show a custom error message which shows the current time in the right format
      const currentTime = new Date()
      let hour = currentTime.getHours()
      const min = (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes()
      const meridiem = (hour >= 12) ? 'pm' : 'am'
      if (hour === 0) {
        hour = 12
      } else if (hour > 12) {
        hour = hour - 12
      }
      setValidity(
        <>Please enter a valid time<br />Example: {hour}:{min} {meridiem}</>
      )
    } else {
      setValidity(null)
      const time = input.value.split(':')
      let hour = Number(time[0])
      const minutes = Number(time[1].split(' ')[0])
      const meridiem = input.value.split(' ')[1].toLowerCase()
      // Make sure the hours match the am/pm
      if (meridiem === 'pm' && hour < 12) {
        hour = hour + 12
      }
      if (hour === 12 && meridiem.toLowerCase() === 'am') {
        hour = 0
      }
      // Update the time
      updateTimeForDate(hour, minutes)
    }
  }

  return (
    <div className="document-field__date">
      <div className="document-field__date-field">
        <DatePicker
          customInput={<CustomDateInput />}
          dateFormat="yyyy-MM-dd hh:mm:ss"
          dropdownMode="select"
          onChange={internalChangeHandler}
          onCalendarOpen={(e) => {
            if (!isReadOnly) {
              onFocus(id, type)
            }
          }}
          onCalendarClose={(e) => {
            delayedBlurHandler(id, type)
          }}
          popperPlacement="top-start"
          popperModifiers={{
            flip: {
              enabled: true
            },
            preventOverflow: {
              enabled: true,
              escapeWithReference: true, // force popper to stay in viewport (even when input is scrolled out of view)
              boundariesElement: 'viewport'
            }
          }}
          readOnly={isReadOnly}
          selected={fieldDate}
          showMonthDropdown
          showYearDropdown
        />
        <span className="document-field__date-label">
          {moment(fieldDate).format('dddd MMMM Do, YYYY')}
        </span>
      </div>
      <div className="document-field__date-field">
        <DatePicker
          customInput={<CustomTimeInput />}
          dateFormat="yyyy-MM-dd hh:mm:ss"
          onChange={(date) => {
            // Take the time from the picker, and update the text field
            let hour = date.getHours()
            let minutes = date.getMinutes()
            minutes = (minutes < 10 ? '0' : '') + minutes
            const meridiem = hour < 12 ? 'am' : 'pm'
            if (hour === 0) {
              hour = 12
            } else if (hour > 12) {
              hour = hour - 12
            }
            // Update the uncontrolled field
            timeRef.current.value = `${hour}:${minutes} ${meridiem}`
            // Update the time
            updateTimeForDate(hour, minutes)
          }}
          onCalendarOpen={(e) => {
            if (!isReadOnly) {
              onFocus(id, type)
            }
          }}
          onCalendarClose={(e) => {
            delayedBlurHandler(id, type)
          }}
          popperPlacement="top-start"
          popperModifiers={{
            flip: {
              enabled: true
            },
            preventOverflow: {
              enabled: true,
              escapeWithReference: true, // force popper to stay in viewport (even when input is scrolled out of view)
              boundariesElement: 'viewport'
            }
          }}
          readOnly={isReadOnly}
          selected={fieldDate}
          showTimeSelect
          showTimeSelectOnly
          timeCaption="Time"
          timeIntervals={15}
        />
        <div className="document-field__date-time">
          <input
            ref={timeRef}
            type="text"
            defaultValue={moment(fieldDate).format('h:mm a')}
            pattern="\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))"
            onChange={setTimeValue}
            onFocus={(e) => {
              if (!isReadOnly) {
                onFocus(id, type)
              }
            }}
            onBlur={(e) => {
              onBlur(id, type)
            }}
          />
          {validity && (
            <Popper anchorRef={timeRef} open={validity !== null} role="tooltip" withArrow>
              <p className="note">{validity}</p>
            </Popper>
          )}
        </div>
      </div>
    </div>
  )
}

FieldDateComponent.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  readOnly: PropTypes.bool.isRequired,
  id: PropTypes.number,
  type: PropTypes.oneOf([FIELD_TYPES.DATE]),
  value: PropTypes.string,
  isBeingRemotelyEdited: PropTypes.bool
}

export default FieldDateComponent
