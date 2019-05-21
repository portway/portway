
export const pick = (obj, fields) => {
  return fields.reduce((pojo, field) => {
    pojo[field] = obj[field]
    return pojo
  }, {})
}

export const uniqueVals = (inputArray) => {
  return inputArray.reduce((uniqueVals, val) => {
    if (!uniqueVals.includes(val)) uniqueVals.push(val)
    return uniqueVals
  }, [])
}