import { FIELD_TYPES, FIELD_TYPE_MODELS } from "../constants/fieldTypes"

const documentToMd = function(document) {
  const frontMatter = getDocumentFrontmatter(document)
  return frontMatter
}

const getDocumentFrontmatter = function(document) {
  const fieldFrontmatter = document.fields.reduce((cur, field) => {
    if (field.type === FIELD_TYPES.TEXT) return cur
    return cur + `${field.name}: ${field.value}\n`
  }, '')

  const content = document.fields.reduce((cur, field) => {
    if (field.type === FIELD_TYPES.TEXT) {
      const fieldValue = field.value ? field.value : ''
      return cur + `${fieldValue}\n\n`
    }
    return cur
  }, '')

  return `---\ntitle: ${document.name}` +
  `\n${fieldFrontmatter}` +
  `---\n` +
  content
}

export default documentToMd
