import React from 'react'
import { FIELD_TYPES } from 'Shared/constants'
import { TextIcon, StringIcon, ImageIcon, NumberIcon } from 'Components/Icons'

const settings = {
  fields: {
    'Content': [
      {
        label: 'Body',
        key: FIELD_TYPES.TEXT,
        icon: <TextIcon />
      },
      {
        label: 'Photo',
        key: FIELD_TYPES.IMAGE,
        icon: <ImageIcon />
      }
    ],
    'Data': [
      {
        label: 'String',
        key: FIELD_TYPES.STRING,
        icon: <StringIcon />
      },
      {
        label: 'Number',
        key: FIELD_TYPES.NUMBER,
        icon: <NumberIcon />
      }
    ]
  }
}

export default settings
