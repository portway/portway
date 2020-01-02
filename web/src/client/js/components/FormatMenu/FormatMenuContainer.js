import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FormatMenuComponent from './FormatMenuComponent'

const FormatMenuContainer = ({ focusedField }) => {
  return <FormatMenuComponent focusedField={focusedField} />
}

FormatMenuContainer.propTypes = {
  focusedField: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    data: PropTypes.object,
  })
}

const mapStateToProps = (state) => {
  return {
    focusedField: state.documentFields.focused
  }
}

export default connect(mapStateToProps)(FormatMenuContainer)
