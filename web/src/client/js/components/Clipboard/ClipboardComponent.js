import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { CheckIcon, ClipboardIcon } from 'Components/Icons'

const ClipboardComponent = ({ copyHandler, copyRef }) => {
  const [copied, setCopied] = useState()
  function copyTokenToClipboard() {
    if (copyRef && copyRef.current) {
      copyRef.current.select()
      document.execCommand('copy')
      copyRef.current.blur()
      setCopied(true)
      if (copyHandler) { copyHandler() }
      // After 5 seconds, change back to a clipboard icon
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }
  return (
    <button aria-label="Copy this to clipboard" className="btn btn--blank btn--with-circular-icon" onClick={copyTokenToClipboard}>
      {copied && <CheckIcon fill="#51a37d" />}
      {!copied && <ClipboardIcon />}
    </button>
  )
}

ClipboardComponent.propTypes = {
  copyHandler: PropTypes.func,
  copyRef: PropTypes.object.isRequired
}

export default ClipboardComponent
