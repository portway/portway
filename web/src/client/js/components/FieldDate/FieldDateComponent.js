import React, { forwardRef, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'

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
  field,
  onBlur,
  onChange,
  onFocus,
  readOnly
}) => {
  const startDate = field && field.value ? new Date(field.value) : new Date()
  const timeRef = useRef()
  const [fieldDate, setFieldDate] = useState(startDate)
  const [validity, setValidity] = useState(null)

  useEffect(() => {
    // todo: delete me then merge
    console.log(fieldDate)
  }, [fieldDate])

  function internalChangeHandler(date) {
    setFieldDate(date)
    onChange(field.id, date)
  }

  function updateTimeForDate(hour, minutes) {
    const newTime = new Date(fieldDate)
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
      const hours = currentTime.getHours()
      const min = (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes()
      const meridiem = (hours >= 12) ? 'PM' : 'AM'
      setValidity(
        <>Please enter a valid time<br />Example: {hours}:{min} {meridiem}</>
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
          readOnly={readOnly}
          selected={fieldDate}
          showMonthDropdown
          showYearDropdown
        />
        <span className="document-field__date-label">{moment(fieldDate).format('dddd MMMM Do, YYYY')}</span>
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
          readOnly={readOnly}
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
          />
          {validity &&
          <Popper anchorRef={timeRef} open={validity !== null} role="tooltip" withArrow>
            <p className="note">{validity}</p>
          </Popper>
          }
        </div>
      </div>
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
