
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
    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('finish', resolve)
    readStream.pipe(writeStream)
  })
}

// Turns a string into a url-safe slug
export const slugify = (string) => {
  if (typeof string !== 'string') {
    throw new Error('Slugify requires type string, got ' + typeof string)
  }

  // Code from https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

}

// This is really just a helper function to make calls
// to any lib that's hard to mock in tests. It puts the
// call in a separate file and lets you get on with testing
export const callFuncWithArgs = (func, ...args) => {
  return func(...args)
}