
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

export const promisifyStreamPipe = (readStream, writeStream) => {
  return new Promise((resolve, reject) => {
    readStream.on('close', resolve)
    readStream.on('error', reject)
    readStream.pipe(writeStream)
  })
}

// This is really just a helper function to make calls
// to any lib that's hard to mock in tests. It puts the
// call in a separate file and lets you get on with testing
export const callFuncWithArgs = (func, ...args) => {
  return func(...args)
}