import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import { debounce } from 'Shared/utilities'
import { CheckIcon } from 'Components/Icons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const Form = ({
  bigSubmit,
  children,
  dispatch,
  forms,
  name,
  onSubmit,
  submitEnabled,
  submitLabel,
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

  function submitHandler(e) {
    e.preventDefault()
    onSubmit()
    setFormChanged(false)
    return false
  }

  const debouncedChangeHandler = debounce(200, () => {
    setFormChanged(true)
  })

  const buttonDisabledWhen = !formChanged || submitting || succeeded
  const submitClasses = cx({
    'btn': true,
    'btn--small': !bigSubmit,
    'btn--disabled': buttonDisabledWhen,
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
      <div className="btn-group">
        <input type="submit" className={submitClasses} disabled={buttonDisabledWhen && !submitEnabled} value={submitLabel} />
        {submitting && <SpinnerComponent color="#e5e7e6" />}
        {succeeded && <CheckIcon fill="#51a37d" />}
      </div>
    </form>
  )
}

Form.propTypes = {
  bigSubmit: PropTypes.bool,
  children: PropTypes.node,
  dispatch: PropTypes.func,
  forms: PropTypes.object,
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  submitEnabled: PropTypes.bool,
  submitLabel: PropTypes.string,
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
