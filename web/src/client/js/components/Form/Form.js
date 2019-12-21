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
  submitEnabled,
  submitLabel,
  submitOnRight,
  ...props,
}) => {
  const formRef = useRef()
  const [formChanged, setFormChanged] = useState(submitEnabled)
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  useEffect(() => {
    setSubmitting(forms[name] && forms[name].submitted && !forms[name].failed && !forms[name].succeeded)
    setFailed(forms[name] && forms[name].failed)
    setSucceeded(forms[name] && forms[name].succeeded && !forms[name].failed)
  })

  useEffect(() => {
    if (!disabled) {
      setFormChanged(true)
    }
  }, [disabled])

  function submitHandler(e) {
    e.preventDefault()
    onSubmit()
    setFormChanged(false)
    return false
  }

  const debouncedChangeHandler = debounce(200, () => {
    if (!disabled) {
      setFormChanged(true)
    }
  })

  const buttonDisabledWhen = disabled || !formChanged || submitting || succeeded
  const submitClasses = cx({
    'btn': true,
    'btn--disabled': buttonDisabledWhen,
  })
  const buttonGroupClasses = cx({
    'btn-group': true,
    'btn-group--right-aligned': submitOnRight
  })

  if (succeeded && formRef.current) {
    formRef.current.reset()
  }

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
        <input type="submit" className={submitClasses} disabled={buttonDisabledWhen && !submitEnabled} value={submitLabel} />
        {cancelHandler &&
          <button className="btn btn--blank btn--small" type="button" onClick={cancelHandler}>Cancel</button>
        }
        {submitting && <SpinnerComponent color="#e5e7e6" />}
        {succeeded && <CheckIcon fill="#51a37d" />}
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
  submitEnabled: PropTypes.bool,
  submitLabel: PropTypes.string,
  submitOnRight: PropTypes.bool,
}

Form.defaultProps = {
  submitLabel: 'Submit',
}

const mapStateToProps = (state) => {
  return {
    forms: state.forms.byName
  }
}

export default connect(mapStateToProps)(Form)
