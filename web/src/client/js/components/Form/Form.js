import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { formSubmitAction, formSucceededAction, formFailedAction } from 'Actions/form'

const Form = ({
  action,
  children,
  errors,
  forms,
  formSubmitAction,
  formSucceededAction,
  formFailedAction,
  name,
  method,
  multipart,
  onSubmit
}) => {
  function submitHandler(e) {
    e.preventDefault()
    formSubmitAction(name)
    onSubmit()
    return false
  }

  if (forms[name] && forms[name].failed && !forms[name].succeeded) {
    console.info('Form failed!')
  }

  if (forms[name] && !forms[name].failed && forms[name].succeeded) {
    console.info('Form succeeded!')
  }

  return (
    <form action={action} method={method} multipart={multipart} name={name} onSubmit={submitHandler}>
      {children}
    </form>
  )
}

Form.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node,
  errors: PropTypes.object,
  forms: PropTypes.object,
  formSubmitAction: PropTypes.func,
  formSucceededAction: PropTypes.func,
  formFailedAction: PropTypes.func,
  method: PropTypes.string,
  multipart: PropTypes.string,
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
}

Form.defaultProps = {
  errors: {},
  multipart: 'false'
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation,
    forms: state.forms.byName
  }
}

const mapDispatchToProps = { formSubmitAction, formSucceededAction, formFailedAction }

export default connect(mapStateToProps, mapDispatchToProps)(Form)
