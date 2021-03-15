import { FIELD_TYPES } from '../../constants/fieldTypes'
import fs from 'fs'
import ejs from 'ejs'
import path from 'path'

const FIELD_VALUE_RENDERING_FILES = {
  [FIELD_TYPES.IMAGE]: 'image.html'
}

const EJS_TEMPLATE_FUNCTIONS = {}

// Pre-compile ejs render functions from files on load
Object.keys(FIELD_VALUE_RENDERING_FILES).forEach((key) => {
  const fileName = FIELD_VALUE_RENDERING_FILES[key]
  EJS_TEMPLATE_FUNCTIONS[key] = ejs.compile(
    fs.readFileSync(path.join(__dirname, fileName), 'utf8'),
    {
      async: true // returns an async render func
    }
  )
})

export function getRenderedValueByType(type, value) {
  switch (type) {
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.TEXT:
    case FIELD_TYPES.IMAGE:
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.FILE:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.IMAGE]({ src: value, alt: 'blah', width: 500, height: 500 })
  }
}