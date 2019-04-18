
export const pick = (obj, fields) => {
  return fields.reduce((pojo, field) => {
    pojo[field] = obj[field]
    return pojo
  }, {})
}