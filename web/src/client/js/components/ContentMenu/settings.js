import React from 'react'
import { FIELD_TYPES } from 'Shared/constants'
import { ProjectIcon } from 'Components/Icons'

const settings = {
  fields: {
    'Content': [
      {
        label: 'Body',
        key: FIELD_TYPES.TEXT,
        icon: <ProjectIcon />
      },
      {
        label: 'Photo',
        key: FIELD_TYPES.TEXT,
        icon: <ProjectIcon />
      },
      {
        label: 'Video',
        key: FIELD_TYPES.TEXT,
        icon: <ProjectIcon />
      },
    ],
    'Data': [
      {
        label: 'String',
        key: FIELD_TYPES.STRING,
        icon: <ProjectIcon />
      },
      {
        label: 'Number',
        key: FIELD_TYPES.NUMBER,
        icon: <ProjectIcon />
      }
    ]
  }
}

export default settings
