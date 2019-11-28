import React from 'react'
import PropTypes from 'prop-types'

import { AddIcon, TextIcon, StringIcon, ImageIcon, NumberIcon } from 'Components/Icons'
import { FIELD_TYPES } from 'Shared/constants'
import DocumentMenuComponent from 'Components/DocumentMenu/DocumentMenuComponent'
import DocumentMenuGroup from 'Components/DocumentMenu/DocumentMenuGroup'
import './ContentMenu.scss'

const ContentMenuComponent = ({ createFieldHandler }) => {
  const button = {
    icon: <AddIcon width="24" height="24" />,
    label: 'Add a field',
  }

  return (
    <DocumentMenuComponent button={button}>
      <DocumentMenuGroup title="Content">
        <button className="btn btn--blank btn--with-icon" role="menuitem" onClick={() => { createFieldHandler(FIELD_TYPES.TEXT) }}>
          <TextIcon width="26" height="26" /> Body
        </button>
        <button className="btn btn--blank btn--with-icon" role="menuitem" onClick={() => { createFieldHandler(FIELD_TYPES.IMAGE) }}>
          <ImageIcon width="26" height="26" /> Photo
        </button>
      </DocumentMenuGroup>
      <DocumentMenuGroup title="Data">
        <button className="btn btn--blank btn--with-icon" role="menuitem" onClick={() => { createFieldHandler(FIELD_TYPES.STRING) }}>
          <StringIcon width="26" height="26" /> String
        </button>
        <button className="btn btn--blank btn--with-icon" role="menuitem" onClick={() => { createFieldHandler(FIELD_TYPES.NUMBER) }}>
          <NumberIcon width="26" height="26" /> Number
        </button>
      </DocumentMenuGroup>
    </DocumentMenuComponent>
  )
}

ContentMenuComponent.propTypes = {
  createFieldHandler: PropTypes.func.isRequired,
}

export default ContentMenuComponent
