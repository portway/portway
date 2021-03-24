import { FIELD_TYPES } from '../../constants/fieldTypes'
import fs from 'fs'
import ejs from 'ejs'
import path from 'path'
import moment from 'moment'
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
  const type = FIELD_TYPES[field.type]
  const name = field.name

  switch (field.type) {
    case FIELD_TYPES.STRING:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.STRING]({ type, name, value })
    case FIELD_TYPES.TEXT:
      const html = renderMarkdownSync(value)
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.TEXT]({ html, type, name, value })
    case FIELD_TYPES.IMAGE:
      // todo: pass in alt, and meta width and height when available
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.IMAGE]({
        type,
        name,
        value,
        alt: field.alt,
        width: field.width,
        height: field.height,
        alignment: field.alignment
      })
    case FIELD_TYPES.NUMBER:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.NUMBER]({ type, name, value })
    case FIELD_TYPES.DATE:
      const formattedDate = field.value && moment(field.value).format('MMMM Do YYYY, h:mm a')
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.DATE]({ type, name, value, formattedDate })
    case FIELD_TYPES.FILE:
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.FILE]({ type, name, value })
  }
}
