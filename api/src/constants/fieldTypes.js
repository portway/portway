// @todo move this to /Shared/constants? web and API should use the same ones
export const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3,
  IMAGE: 4,
  DATE: 5,
  FILE: 6
}

export const FIELD_TYPE_MODELS = {
  [FIELD_TYPES.STRING]: 'FieldTypeStringValue',
  [FIELD_TYPES.TEXT]: 'FieldTypeTextValue',
  [FIELD_TYPES.NUMBER]: 'FieldTypeNumberValue',
  [FIELD_TYPES.IMAGE]: 'FieldTypeImageValue',
  [FIELD_TYPES.DATE]: 'FieldTypeDateValue',
  [FIELD_TYPES.FILE]: 'FieldTypeFileValue'
}

export const MAX_NUMBER_PRECISION = 15
// 100 Megabytes
export const MAX_FILE_SIZE_BYTES = 10e7

export const IMAGE_ALIGNMENT_OPTIONS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
}

export const FIELD_PROPS_TO_COPY = ['type', 'value', 'order', 'name', 'structuredValue', 'meta', 'alt', 'alignment', 'formats']

export default { FIELD_TYPES, FIELD_TYPE_MODELS }
