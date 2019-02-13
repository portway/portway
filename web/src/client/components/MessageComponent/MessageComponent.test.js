import React from 'react'
import { shallow } from 'enzyme'

import MessageComponent from './MessageComponent'

describe('<MessageComponent />', () => {
  let visible
  let type
  let message
  let onDeleteHandler

  beforeEach(() => {
    visible = true
    type = 'info'
    message = 'test message'
    onDeleteHandler = jest.fn()
  })

  describe('render()', () => {
    it('should render the component with correct message', () => {
      const component = shallow(
        <MessageComponent
          visible={visible}
          type={type}
          message={message}
          onDelete={onDeleteHandler}
        />
      )
      expect(component.find('.message-body').text()).toContain(message)
    })

    it('should not render the component if passed visible: false', () => {
      const component = shallow(
        <MessageComponent
          visible={false}
          type={type}
          message={message}
          onDelete={onDeleteHandler}
        />
      )
      expect(component.equals(null)).toBe(true)
    })

    it('should call onDeleteHandler when the delete button is clicked', () => {
      const component = shallow(
        <MessageComponent
          visible={visible}
          type={type}
          message={message}
          onDelete={onDeleteHandler}
        />
      )
      component.find('.delete').simulate('click')
      expect(onDeleteHandler.mock.calls.length).toBe(1)
    })
  })
})
