import React from 'react'
import MessageComponent from './MessageComponent'

class MessageComponentContainer extends React.Component {
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
    return <MessageComponent visible={this.state.visible} type={this.props.type} message={this.props.message} onDelete={this.deleteHandler.bind(this)} />
  }

  deleteHandler() {
    this.setState({ visible: false })
  }

}

export default MessageComponentContainer
