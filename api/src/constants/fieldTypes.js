
// @todo move this to /Shared/constants? web and API should use the same ones
const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3
}

const FIELD_TYPE_MODELS = {
  [FIELD_TYPES.STRING]: 'FieldTypeStringValue',
  [FIELD_TYPES.TEXT]: 'FieldTypeTextValue',
  [FIELD_TYPES.NUMBER]: 'FieldTypeNumberValue'
}

export default { FIELD_TYPES, FIELD_TYPE_MODELS }
