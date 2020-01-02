import Joi from 'joi'
import fieldTypes from '../../constants/fieldTypes'

export const rawSchema = {
  name: Joi.string().max(50),
  value: Joi.alternatives(Joi.string(), Joi.number().strict()).allow(null).allow(''),
  // TODO: probably want a shared json parse validator on structuredValue
  structuredValue: Joi.string().allow(null),
  type: Joi.number().valid(Object.values(fieldTypes.FIELD_TYPES))
}

export default Joi.compile(rawSchema)
