import Joi from 'joi'
import fieldTypes from '../../constants/fieldTypes'

export const rawSchema = {
  name: Joi.string(),
  value: Joi.alternatives(Joi.string(), Joi.number()).allow(null),
  // TODO: probably want a shared json parse validator on structuredValue
  structuredValue: Joi.string().allow(null),
  type: Joi.number().valid(Object.values(fieldTypes.FIELD_TYPES))
  // TODO: order: need to decide how to handle this
}

export default Joi.compile(rawSchema)
