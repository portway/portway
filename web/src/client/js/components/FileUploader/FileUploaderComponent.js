import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { DropIcon } from 'Components/Icons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './FileUploader.scss'

const FileUploaderComponent = ({
  accept,
  children,
  hasValue,
  isUpdating,
  label,
  fileChangeHandler,
  clickHandler,
  blurHandler,
  fileUploadedHandler,
  multiple
}) => {
  const [draggedOver, setDraggedOver] = useState(false)
  const [uploading, setUploading] = useState(null)
  const [monitor, setMonitor] = useState(null)

  useEffect(() => {
    // We set uploading in this component, due to delay in redux state change of isUpdating
    // Once we are both uploading && isUpdating, we should set a variable to watch
    if (uploading && isUpdating) {
      console.info('⏱ Monitoring file...')
      setMonitor(true)
    }
    if (monitor && uploading && !isUpdating) {
      // If our watched variable is true, uploading is true, and isUpdating is false,
      // that means we are actually done uploading the file
      setMonitor(false)
      setUploading(false)
      if (fileUploadedHandler) {
        fileUploadedHandler()
      }
      console.info(`✅ Upload complete`)
    }
  }, [monitor, uploading, isUpdating, fileUploadedHandler])

  function dragEnterHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('text/html')) {
      return
    }
    setDraggedOver(true)
  }

  function dragOverHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('text/html')) {
      return
    }
    setDraggedOver(true)
  }

  function dragLeaveHandler(e) {
    e.preventDefault()
    setDraggedOver(false)
  }

  function dropHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('text/html')) {
      return
    }
    setDraggedOver(false)
    setUploading(true)
    const dt = e.dataTransfer
    const files = dt.files
    fileChangeHandler(multiple ? files : files[0])
  }

  // File upload class states
  const fileUploaderClasses = cx({
    'file-uploader': true,
    'file-uploader--with-value': hasValue,
    'file-uploader--dragged-over': draggedOver,
    'file-uploader--uploading': uploading
  })

  return (
    <div
      className={fileUploaderClasses}
      onDragEnter={dragEnterHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}>
      {!uploading && !isUpdating &&
      <form className="file-uploader__form" method="post" encType="multipart/form-data">
        <DropIcon className="file-uploader__icon" width="32" height="32" />
        <label className="file-uploader__content">
          <span className="file-uploader__label">{label}</span>
          <span className="btn btn--small btn--cyan">Or select a file</span>
          <input
            hidden
            type="file"
            accept={accept}
            multiple={multiple}
            onClick={() => { clickHandler && clickHandler() }}
            onBlur={console.log}
            onChange={(e) => {
              console.log('change')
              blurHandler && blurHandler()
              setUploading(true)
              fileChangeHandler(multiple ? e.target.files : e.target.files[0])
            }}
          />
        </label>
        {children}
      </form>
      }
      {isUpdating &&
      <div className="file-uploader__status">
        <SpinnerComponent />
      </div>
      }
    </div>
  )
}

FileUploaderComponent.propTypes = {
  accept: PropTypes.string,
  children: PropTypes.node,
  hasValue: PropTypes.bool,
  isUpdating: PropTypes.bool,
  label: PropTypes.string,
  fileChangeHandler: PropTypes.func.isRequired,
  clickHandler: PropTypes.func,
  blurHandler: PropTypes.func,
  fileUploadedHandler: PropTypes.func,
  multiple: PropTypes.bool,
}

FileUploaderComponent.defaultProps = {
  accept: 'image/*',
  hasValue: false,
  isUpdating: false,
  label: 'Drag and drop a file',
  multiple: false,
}

export default FileUploaderComponent
