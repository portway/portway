import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ValidationComponent from './ValidationComponent'

const ValidationContainer = ({ resource, validation, value }) => {
  return <ValidationComponent errors={validation[resource][value]} />
}

ValidationContainer.propTypes = {
  resource: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
  return {
    validation: state.validation
  }
}

export default connect(mapStateToProps)(ValidationContainer)
