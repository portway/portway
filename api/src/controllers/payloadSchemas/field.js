import Joi from '@hapi/joi'
import fieldTypes, { FIELD_TYPES } from '../../constants/fieldTypes'

export const rawSchema = {
  name: Joi.string().max(50),
  value: Joi.any().when('type', { 
    switch: [
      { is: FIELD_TYPES.TEXT, then: Joi.string() },
      { is: FIELD_TYPES.STRING, then: Joi.string() },
      { is: FIELD_TYPES.IMAGE, then: Joi.string() },
      { is: FIELD_TYPES.NUMBER, then: Joi.number().strict() },
      { is: FIELD_TYPES.DATE, then: Joi.date().iso() }
    ],
    otherwise: Joi.invalid()
  }).allow(null).allow(''),
  //Joi.alternatives(Joi.string(), Joi.number().strict()).allow(null).allow(''),
  // TODO: probably want a shared json parse validator on structuredValue
  structuredValue: Joi.string().allow(null),
  type: Joi.number().valid(...Object.values(fieldTypes.FIELD_TYPES)).required()
}

export default Joi.compile(rawSchema)
