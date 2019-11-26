import React from 'react'
// import PropTypes from 'prop-types'

import { FormatIcon } from 'Components/Icons'
import DocumentMenuComponent from 'Components/DocumentMenu/DocumentMenuComponent'
import DocumentMenuGroup from 'Components/DocumentMenu/DocumentMenuGroup'

import './_FormatMenu.scss'

const FormatMenuComponent = () => {
  const button = {
    icon: <FormatIcon width="24" height="24" />,
    label: 'Format tools'
  }
  return (
    <DocumentMenuComponent button={button}>
      <DocumentMenuGroup>
        <button className="btn btn--blank">
          <span className="format-menu__format">#</span> Heading 1
        </button>
        <button className="btn btn--blank">
          <span className="format-menu__format">##</span> Heading 2
        </button>
        <button className="btn btn--blank">
          <span className="format-menu__format">###</span> Heading 3
        </button>
        <button className="btn btn--blank">
          <span className="format-menu__format">####</span> Heading 4
        </button>
      </DocumentMenuGroup>
      <DocumentMenuGroup>
        <button className="btn btn--blank">
          <span className="format-menu__format">*</span> <b>Bold</b>&nbsp;*
        </button>
        <button className="btn btn--blank">
          <span className="format-menu__format">/</span> <i>Italic</i>&nbsp;/
        </button>
      </DocumentMenuGroup>
    </DocumentMenuComponent>
  )
}

FormatMenuComponent.propTypes = {
}

export default FormatMenuComponent
