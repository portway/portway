import Joi from 'joi'

export function validateBody(schema) {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema.body, {
      allowUnknown: true
    })

    if (!error) {
      return next()
    }

    res.status(400).send('Invalid request payload input')
  }
}

export function validateParams(schema) {
  return (req, res, next) => {
    const { error } = Joi.validate(req.params, schema.params, {
      allowUnknown: true
    })

    if (!error) {
      return next()
    }

    res.status(400).send('Invalid request')
  }
}
