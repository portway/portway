import React from 'react'
import PropTypes from 'prop-types'
import MessageComponent from './MessageComponent'

class MessageContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.visible
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.visible !== this.props.visible) {
      this.setState({ visible: this.props.visible })
    }
  }

  render() {
    return (
      <MessageComponent
        visible={this.state.visible}
        type={this.props.type}
        message={this.props.message}
        onDelete={this.deleteHandler.bind(this)} />
    )
  }

  deleteHandler() {
    this.setState({ visible: false })
  }
}

MessageContainer.propTypes = {
  visible: PropTypes.bool,
  type: PropTypes.string,
  message: PropTypes.string
}

export default MessageContainer
