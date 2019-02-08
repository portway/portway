import React from 'react'
import './MessageComponent.scss'

class MessageComponent extends React.PureComponent {
  render() {
    const typeClass = {
      'error': 'is-danger',
      'info': 'is-info',
      'success': 'is-success',
      'warning': 'is-warning'
    }
    if (this.props.visible) {
      return (
        <article id="card-errors" className={`message ${typeClass[this.props.type]}`}>
          <div className="message-header">
            <p>Something went wrong...</p>
            <button className="delete" aria-label="delete" onClick={this.props.onDelete} />
          </div>
          <div className="message-body">{this.props.message}</div>
        </article>
      )
    } else {
      return null
    }
  }
}

export default MessageComponent
