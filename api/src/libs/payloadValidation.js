import Joi from 'joi'

export default function validate(schema) {
  return (req, res, next) => {
    const { error } = Joi.validate(req, schema, {
      allowUnknown: true
    })

    if (!error) {
      return next()
    }

    res.status(400).send('Invalid request payload input')
  }
}