import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ReactCrop from 'react-image-crop'

import './_ReactCrop.scss'
import './_ImageCropper.scss'

const ImageCropperComponent = ({ children, circle, height, image, onComplete, width }) => {
  const [crop, setCrop] = useState({ aspect: 1, circle: circle, unit: '%', width: 100 })
  const cropperRef = useRef()

  const imageStyle = {
    maxWidth: '350px',
    minWidth: '64px',
  }

  function changeCropHandler(newCrop) {
    setCrop(newCrop)
  }

  async function completeCropHandler(newCrop) {
    if (newCrop.width && newCrop.height) {
      const cropData = await getCroppedImage(image, newCrop)
      onComplete(cropData)
    }
  }

  function getCroppedImage(image, newCrop) {
    // Create an image
    const newImage = new Image()
    newImage.src = image
    const canvas = document.createElement('canvas')
    // Divide the original image by what we're seeing on screen in the DOM
    const scaleX = newImage.naturalWidth / cropperRef.current.imageRef.width
    const scaleY = newImage.naturalHeight / cropperRef.current.imageRef.height
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    // Draw the image to canvas so we can convert it to a blob
    ctx.drawImage(
      newImage,
      newCrop.x * scaleX,
      newCrop.y * scaleY,
      newCrop.width * scaleX,
      newCrop.height * scaleY,
      0,
      0,
      width,
      height
    )
    // Return the blob and URL to the blob for previewing
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('No canvas found'))
        }
        resolve({
          blobURL: window.URL.createObjectURL(blob),
          blobData: blob
        })
      }, 'image/png', 1)
    })
  }

  return (
    <div className="image-cropper">
      <ReactCrop
        circularCrop={circle}
        crop={crop}
        imageStyle={imageStyle}
        onChange={changeCropHandler}
        onComplete={completeCropHandler}
        ref={cropperRef}
        src={image}
      />
      <div className="image-cropper__content">
        {children}
      </div>
    </div>
  )
}

ImageCropperComponent.propTypes = {
  children: PropTypes.node,
  circle: PropTypes.bool,
  height: PropTypes.number,
  image: PropTypes.string,
  onComplete: PropTypes.func,
  width: PropTypes.number,
}

ImageCropperComponent.defaultProps = {
  circle: false,
  height: 200,
  width: 200
}

export default ImageCropperComponent
