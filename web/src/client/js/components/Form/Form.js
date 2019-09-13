import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { CheckIcon } from 'Components/Icons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const Form = ({
  action,
  children,
  errors,
  forms,
  name,
  method,
  multipart,
  onSubmit,
  submitLabel
}) => {
  const formRef = useRef()
  const [formChanged, setFormChanged] = useState(false)

  function submitHandler(e) {
    e.preventDefault()
    onSubmit()
    return false
  }

  function changeHandler(e) {
    setFormChanged(true)
  }

  const submitting = forms[name] && forms[name].submitted && !forms[name].failed && !forms[name].succeeded
  const failed = forms[name] && forms[name].failed
  const succeeded = forms[name] && forms[name].succeeded

  const buttonDisabledWhen = !formChanged || submitting || failed || succeeded

  if (forms[name] && forms[name].failed && !forms[name].succeeded) {
    // console.error('Form failed!')
  }

  if (forms[name] && !forms[name].failed && forms[name].succeeded) {
    // console.error('Form succeeded!')
    formRef.current.reset()
  }

  return (
    <form
      ref={formRef}
      action={action}
      method={method}
      multipart={multipart}
      name={name}
      onChange={changeHandler}
      onSubmit={submitHandler}>
      {children}
      {failed &&
      <div>
        <p className="danger">Please check your form for errors</p>
      </div>
      }
      <div className="btn-group">
        <button className="btn btn--small" disabled={buttonDisabledWhen}>{submitLabel}</button>
        {submitting && <SpinnerComponent />}
        {succeeded && <CheckIcon fill="#51a37d" />}
      </div>
    </form>
  )
}

Form.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node,
  errors: PropTypes.object,
  forms: PropTypes.object,
  method: PropTypes.string,
  multipart: PropTypes.string,
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
}

Form.defaultProps = {
  errors: {},
  multipart: 'false',
  submitLabel: 'Submit',
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation,
    forms: state.forms.byName
  }
}

export default connect(mapStateToProps)(Form)
