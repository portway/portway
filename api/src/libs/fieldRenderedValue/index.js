import { FIELD_TYPES } from '../../constants/fieldTypes'
import fs from 'fs'
import ejs from 'ejs'
import path from 'path'
import { renderMarkdownSync } from '../../coordinators/markdown'

const FIELD_VALUE_RENDERING_FILES = {
  [FIELD_TYPES.STRING]: 'string.html',
  [FIELD_TYPES.TEXT]: 'text.html',
  [FIELD_TYPES.IMAGE]: 'image.html',
  [FIELD_TYPES.NUMBER]: 'number.html',
  [FIELD_TYPES.DATE]: 'date.html',
  [FIELD_TYPES.FILE]: 'file.html'
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

/**
 * Takes a field body and returns the rendered value for each type of field
 * @param {FieldBody} field -
 */
export function getRenderedValueByType(field) {
  const value = field.value

  switch (field.type) {
    case FIELD_TYPES.STRING:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.STRING]({ value })
    case FIELD_TYPES.TEXT:
      const html = renderMarkdownSync(value)
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.TEXT]({ html })
    case FIELD_TYPES.IMAGE:
      // todo: pass in alt, and meta width and height when available
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.IMAGE]({ value, alt: 'temporary alt', width: 500, height: 500 })
    case FIELD_TYPES.NUMBER:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.NUMBER]({ value })
    case FIELD_TYPES.DATE:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.DATE]({ value })
    case FIELD_TYPES.FILE:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.FILE]({ value, name: field.name })
  }
}
