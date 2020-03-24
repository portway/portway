import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import { debounce } from 'Shared/utilities'
import { CheckIcon } from 'Components/Icons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const Form = ({
  cancelHandler,
  children,
  disabled,
  dispatch,
  forms,
  name,
  onSubmit,
  submitLabel,
  submitOnRight,
  ...props,
}) => {
  const formRef = useRef()
  const [formChanged, setFormChanged] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const gray10 = getComputedStyle(document.documentElement).getPropertyValue('--color-gray-10')
  const green = getComputedStyle(document.documentElement).getPropertyValue('--color-green')

  useEffect(() => {
    const isSubmitting = forms[name] && forms[name].submitted && !forms[name].failed && !forms[name].succeeded
    const hasFailed = forms[name] && forms[name].failed
    const hasSucceeded = forms[name] && forms[name].succeeded && !forms[name].failed
    setSubmitting(isSubmitting || false)
    setFailed(hasFailed || false)
    setSucceeded(hasSucceeded || false)
    if (succeeded && formRef.current) {
      formRef.current.reset()
    }
  }, [forms, name, succeeded])

  useEffect(() => {
    if (disabled === false) {
      setFormChanged(true)
    }
  }, [disabled])

  function submitHandler(e) {
    e.preventDefault()
    onSubmit(e)
    setFormChanged(false)
    return false
  }

  const debouncedChangeHandler = debounce(200, () => {
    if (!disabled) {
      setFormChanged(true)
    }
  })

  const buttonDisabledWhen = !formChanged || submitting || succeeded

  const submitClasses = cx({
    'btn': true,
    'btn--disabled': buttonDisabledWhen,
  })
  const buttonGroupClasses = cx({
    'btn-group': true,
    'btn-group--right-aligned': submitOnRight
  })

  return (
    <form
      className="form"
      name={name}
      onChange={debouncedChangeHandler}
      onSubmit={submitHandler}
      ref={formRef}
      {...props}>
      {children}
      {failed &&
      <div>
        <p className="danger">Please check your form for errors</p>
      </div>
      }
      <div className={buttonGroupClasses}>
        <input type="submit" className={submitClasses} disabled={buttonDisabledWhen} value={submitLabel} />
        {cancelHandler &&
          <button className="btn btn--blank btn--small" type="button" onClick={cancelHandler}>Cancel</button>
        }
        {submitting && <SpinnerComponent color={gray10} />}
        {succeeded && <CheckIcon fill={green} />}
      </div>
    </form>
  )
}

Form.propTypes = {
  cancelHandler: PropTypes.func,
  children: PropTypes.node,
  dispatch: PropTypes.func,
  disabled: PropTypes.bool,
  forms: PropTypes.object,
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  submitOnRight: PropTypes.bool,
}

Form.defaultProps = {
  // disabled: true,
  submitLabel: 'Submit',
}

const mapStateToProps = (state) => {
  return {
    forms: state.forms.byName
  }
}

export default connect(mapStateToProps)(Form)
